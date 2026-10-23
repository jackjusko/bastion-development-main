/**
 * SQLite driver. Same interface as the MySQL driver so routes never branch on storage.
 *
 * dbGet returns 0 when no row matches, matching the MySQL driver used in production.
 */
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const config = require('../config');

let db = null;

function runExec(sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

exports.initDB = function initDB(options) {
  const sqlitePath = (options && options.sqlitePath) || config.sqlitePath;
  if (sqlitePath !== ':memory:') {
    const dir = path.dirname(sqlitePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  if (db) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(sqlitePath, (err) => {
      if (err) {
        reject(err);
        return;
      }
      const schemaPath = (options && options.schemaPath) || config.schemaPath;
      const schema = fs.readFileSync(schemaPath, 'utf8');
      runExec(schema).then(resolve).catch(reject);
    });
  });
};

/**
 * Close the current connection so tests can start from an empty database.
 */
exports.closeDB = function closeDB() {
  return new Promise((resolve) => {
    if (!db) {
      resolve();
      return;
    }
    db.close(() => {
      db = null;
      resolve();
    });
  });
};

exports.dbGet = function dbGet(query, parameterArray) {
  return new Promise((resolve) => {
    db.get(query, parameterArray, (err, row) => {
      if (err) {
        console.log(err);
        resolve(0);
        return;
      }
      resolve(row || 0);
    });
  });
};

exports.dbAll = function dbAll(query, parameterArray) {
  return new Promise((resolve) => {
    db.all(query, parameterArray, (err, rows) => {
      if (err) {
        console.log(err);
        resolve([]);
        return;
      }
      resolve(rows || []);
    });
  });
};

exports.dbRun = function dbRun(query, parameterArray) {
  return new Promise((resolve) => {
    db.run(query, parameterArray, function onRun(err) {
      if (err) {
        console.log(err);
        resolve(0);
        return;
      }
      resolve(1);
    });
  });
};
