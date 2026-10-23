/**
 * Direct coverage for token resolution used by every authenticated route.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

describe('auth module', () => {
  let dbModule;
  let authModule;
  let sqlitePath;

  beforeEach(async () => {
    sqlitePath = path.join(os.tmpdir(), `bastion-auth-${Date.now()}-${Math.random()}.db`);
    vi.resetModules();
    dbModule = require('../modules/database-sqlite');
    await dbModule.closeDB();
    await dbModule.initDB({ sqlitePath });
    authModule = require('../modules/auth');
  });

  afterEach(async () => {
    await dbModule.closeDB();
    if (sqlitePath && fs.existsSync(sqlitePath)) {
      fs.unlinkSync(sqlitePath);
    }
  });

  it('generateToken returns 30 alphanumeric characters', () => {
    const token = authModule.generateToken();
    expect(token).toMatch(/^[a-zA-Z0-9]{30}$/);
  });

  it('resolveUserId returns 0 for missing or unknown tokens', async () => {
    expect(await authModule.resolveUserId('')).toBe(0);
    expect(await authModule.resolveUserId('not-a-real-token')).toBe(0);
  });

  it('resolveUserId and resolveAdminId follow USER flags', async () => {
    const token = await authModule.register('pat@example.com', 'secret123', 0, [
      { inputAnswer: 'Pat Member' }
    ]);
    const userId = await authModule.resolveUserId(token);
    expect(userId).toBeGreaterThan(0);
    expect(await authModule.resolveAdminId(token)).toBe(0);

    await dbModule.dbRun('UPDATE USER SET ADMIN = 1 WHERE ID = ?;', [userId]);
    expect(await authModule.resolveAdminId(token)).toBe(userId);
  });
});
