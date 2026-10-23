/**
 * Bastion HTTP entrypoint.
 *
 * createApp() builds the Express application so tests can mount it without
 * binding a port. Running this file directly starts the local HTTP server
 * and serves the Vue client from frontend-vue/.
 */
const path = require('path');
const fs = require('fs');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jimp = require('jimp');
const config = require('./config');

const defaultPricingDescription =
  'Expert 1-on-1 coaching, customized workouts, personalized meal plans, daily access to your own fitness and well coach.';
const defaultPricingDescriptionWithCalls =
  'Expert 1-on-1 coaching, customized workouts, personalized meal plans, daily access to your own fitness and well coach and weekly zoom calls.';

/**
 * Build the Express app with optional module overrides for tests.
 *
 * @param {object} [overrides]
 * @returns {import('express').Express}
 */
function createApp(overrides) {
  const deps = overrides || {};
  const dbModule = deps.dbModule || require('./modules/database');
  const authModule = deps.authModule || require('./modules/auth');
  const resourceModule = deps.resourceModule || require('./modules/resources');
  const mailModule = deps.mailModule || require('./modules/mail');
  const requestValidator = deps.requestValidator || require('./modules/requestValidator');
  const billingModule = deps.billingModule || require('./modules/billing');
  const appConfig = deps.config || config;

  const app = express();

  app.use(cors({
    origin: appConfig.corsOrigin,
    allowedHeaders: ['Content-Type', 'token'],
    credentials: true
  }));

  app.use(express.static(appConfig.vueStaticDir));

  const landingDir = path.join(__dirname, '..', 'landing');
  if (fs.existsSync(landingDir)) {
    app.use('/landing', express.static(landingDir));
  }

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ limit: '50mb' }));

  app.get('/blog*', async function blogProxy(req, res) {
    const request = require('request');
    const proxiedUrl = 'https://blog.bastionfit.com' + req.originalUrl.substring(5);
    req.pipe(request(proxiedUrl)).pipe(res);
  });

  app.use(async function validatePayload(req, res, next) {
    const requestIsValid = await requestValidator.validateRequest(req.originalUrl, req.body);
    if (!requestIsValid) {
      res.sendStatus(400);
      return;
    }
    next();
  });

  const routeDependencies = {
    authModule,
    resourceModule,
    mailModule,
    dbModule,
    billingModule,
    jimp,
    desc1: defaultPricingDescription,
    desc2: defaultPricingDescriptionWithCalls
  };

  const routeRegistrars = [
    require('./routes/authRoutes'),
    require('./routes/profileRoutes'),
    require('./routes/pricingRoutes'),
    require('./routes/clientRoutes'),
    require('./routes/messageRoutes'),
    require('./routes/reviewRoutes'),
    require('./routes/adminRoutes'),
    require('./routes/coachRoutes'),
    require('./routes/stripeRoutes')
  ];

  routeRegistrars.forEach((register) => register(app, routeDependencies));
  app.locals.dbModule = dbModule;
  return app;
}

async function startServer() {
  const dbModule = require('./modules/database');
  await dbModule.initDB();
  const app = createApp({ dbModule });
  http.createServer(app).listen(config.port, () => {
    console.log(`Bastion API listening on ${config.publicUrl}`);
  });
}

if (require.main === module) {
  startServer().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = {
  createApp,
  startServer
};
