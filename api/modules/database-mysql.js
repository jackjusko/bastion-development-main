/**
 * MySQL / Amazon RDS driver. Credentials come from environment variables.
 */
const mysql = require('mysql');
const config = require('../config');

let connection = null;

exports.initDB = function initDB() {
  if (connection) {
    return;
  }
  connection = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
  });
  connection.connect();
};

exports.closeDB = function closeDB() {
  return new Promise((resolve) => {
    if (!connection) {
      resolve();
      return;
    }
    connection.end(() => {
      connection = null;
      resolve();
    });
  });
};

exports.dbGet = function dbGet(query, parameterArray) {
  return new Promise((resolve) => {
    connection.query(query, parameterArray, (err, results) => {
      if (err) {
        console.log(err);
        resolve(0);
        return;
      }
      if (!results || results.length === 0) {
        resolve(0);
        return;
      }
      resolve(results[0]);
    });
  });
};

exports.dbAll = function dbAll(query, parameterArray) {
  return new Promise((resolve) => {
    connection.query(query, parameterArray, (err, results) => {
      if (err) {
        console.log(err);
        resolve([]);
        return;
      }
      resolve(results);
    });
  });
};

exports.dbRun = function dbRun(query, parameterArray) {
  return new Promise((resolve) => {
    connection.query(query, parameterArray, (err) => {
      if (err) {
        console.log(err);
        resolve(0);
        return;
      }
      resolve(1);
    });
  });
};
