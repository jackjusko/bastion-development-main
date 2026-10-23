/**
 * HTTP-level coverage for auth, validation, offers, subscribe, and admin invite.
 * Stripe and SES are unused here because keys are empty in the test environment.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const request = require('supertest');

const mailModule = {
  sendThankYou: vi.fn().mockResolvedValue('ok'),
  sendOfferEmail: vi.fn().mockResolvedValue('ok'),
  inviteCoach: vi.fn().mockResolvedValue('ok'),
  sendResetPassword: vi.fn().mockResolvedValue('ok')
};

const surveyAnswers = [
  { prompt: 'Name', type: 'input', inputAnswer: 'Alex Client', multiselectAnswer: '' }
];

function makeApp(dbModule) {
  const { createApp } = require('../bastion');
  return createApp({ dbModule, mailModule });
}

async function register(app, overrides) {
  const body = {
    email: 'client@example.com',
    password: 'password123',
    isCoach: 0,
    surveyAnswers,
    ...overrides
  };
  const res = await request(app).post('/createAccount').send(body);
  return { res, body };
}

describe('Bastion API', () => {
  let dbModule;
  let sqlitePath;

  beforeEach(async () => {
    sqlitePath = path.join(os.tmpdir(), `bastion-test-${Date.now()}-${Math.random()}.db`);
    vi.resetModules();
    dbModule = require('../modules/database-sqlite');
    await dbModule.closeDB();
    await dbModule.initDB({ sqlitePath });
  });

  afterEach(async () => {
    await dbModule.closeDB();
    if (sqlitePath && fs.existsSync(sqlitePath)) {
      fs.unlinkSync(sqlitePath);
    }
  });

  it('rejects login payloads missing required fields', async () => {
    const app = makeApp(dbModule);
    const res = await request(app).post('/login').send({ email: 'a@b.com' });
    expect(res.status).toBe(400);
  });

  it('registers a client and returns a session token', async () => {
    const app = makeApp(dbModule);
    const { res } = await register(app);
    expect(res.status).toBe(200);
    expect(String(res.text).length).toBe(30);
  });

  it('logs in with the same credentials', async () => {
    const app = makeApp(dbModule);
    await register(app, { email: 'login@example.com' });
    const res = await request(app).post('/login').send({
      email: 'login@example.com',
      password: 'password123'
    });
    expect(res.status).toBe(200);
    expect(String(res.text).length).toBe(30);
  });

  it('rejects a duplicate email with 409', async () => {
    const app = makeApp(dbModule);
    await register(app, { email: 'dup@example.com' });
    const { res } = await register(app, { email: 'dup@example.com' });
    expect(res.status).toBe(409);
  });

  it('resolves the token to profile info', async () => {
    const app = makeApp(dbModule);
    const { res } = await register(app, { email: 'profile@example.com' });
    const token = res.text;
    const profile = await request(app).get('/getProfileInfo').set('token', token);
    expect(profile.status).toBe(200);
    expect(profile.body.NAME).toBe('Alex Client');
    expect(profile.body.ISCOACH).toBe(0);
  });

  it('sends an offer and lets the client start coaching', async () => {
    const app = makeApp(dbModule);
    const coachSurvey = [{ prompt: 'Name', type: 'input', inputAnswer: 'Casey Coach', multiselectAnswer: '' }];
    const coachRes = await register(app, {
      email: 'coach@example.com',
      isCoach: 1,
      surveyAnswers: coachSurvey
    });
    const clientRes = await register(app, { email: 'member@example.com' });
    const coachToken = coachRes.res.text;
    const clientToken = clientRes.res.text;

    const coachProfile = await request(app).get('/getProfileInfo').set('token', coachToken);
    const clientProfile = await request(app).get('/getProfileInfo').set('token', clientToken);
    const pricings = await request(app).get('/getPricings').set('token', coachToken);
    expect(pricings.body.length).toBeGreaterThan(0);

    const offerRes = await request(app)
      .post('/sendOffer')
      .set('token', coachToken)
      .send({
        clientID: clientProfile.body.ID,
        planID: pricings.body[0].ID,
        greeting: 'Happy to coach you.'
      });
    expect(offerRes.status).toBe(200);

    const offers = await request(app).get('/getOffers').set('token', clientToken);
    expect(offers.body.length).toBe(1);

    const start = await request(app)
      .post('/startCoaching')
      .set('token', clientToken)
      .send({ offerID: offers.body[0].ID });
    expect(start.status).toBe(200);

    const updated = await request(app).get('/getProfileInfo').set('token', clientToken);
    expect(updated.body.COACHID).toBe(coachProfile.body.ID);
  });

  it('lets an admin invite a coach', async () => {
    const app = makeApp(dbModule);
    const { res } = await register(app, { email: 'admin@example.com' });
    const adminRow = await dbModule.dbGet('SELECT ID FROM USER WHERE EMAIL LIKE ?;', ['admin@example.com']);
    await dbModule.dbRun('UPDATE USER SET ADMIN = 1 WHERE ID = ?;', [adminRow.ID]);

    const invite = await request(app)
      .post('/adminInviteCoach')
      .set('token', res.text)
      .send({ email: 'newcoach@example.com', password: 'temp-pass', name: 'Jordan Coach' });
    expect(invite.status).toBe(200);
    expect(mailModule.inviteCoach).toHaveBeenCalled();

    const coaches = await request(app).get('/adminGetCoaches').set('token', res.text);
    expect(coaches.body.some((row) => row.NAME === 'Jordan Coach')).toBe(true);
  });
});
