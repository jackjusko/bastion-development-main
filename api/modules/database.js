/**
 * Database facade.
 *
 * Routes and modules import this file only. The SQLite and MySQL drivers
 * expose initDB, dbGet, dbAll, and dbRun with identical contracts so the
 * rest of the application does not branch on storage.
 */
const config = require('../config');

const driver = config.databaseDriver === 'mysql'
  ? require('./database-mysql')
  : require('./database-sqlite');

module.exports = driver;
