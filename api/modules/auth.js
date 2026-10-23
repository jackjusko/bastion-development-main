/**
 * Account credentials and opaque session tokens.
 *
 * Tokens are 30-character random strings stored on USER.TOKEN. Clients send
 * them in the `token` request header. This is not JWT and not a server session.
 */
const bcrypt = require('bcrypt');
const dbModule = require('./database');

/**
 * @returns {string} A 30-character alphanumeric token.
 */
exports.generateToken = function generateToken() {
  let tString = '';
  const usableTokenCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  for (let i = 0; i < 30; i++) {
    tString += usableTokenCharacters[Math.floor(Math.random() * usableTokenCharacters.length)];
  }
  return tString;
};

/**
 * Resolve a request token to a user id, or 0 when missing/unknown.
 * An empty token is coerced to "a" so the SQL always binds a string.
 */
exports.resolveUserId = async function resolveUserId(token) {
  if (!token) {
    token = 'a';
  }
  const IDRow = await dbModule.dbGet('SELECT ID FROM USER WHERE TOKEN LIKE ?;', [token]);
  if (IDRow) {
    return IDRow.ID;
  }
  return 0;
};

/**
 * Like resolveUserId, but only for users with ADMIN = 1.
 */
exports.resolveAdminId = async function resolveAdminId(token) {
  if (!token) {
    token = 'a';
  }
  const IDRow = await dbModule.dbGet('SELECT ID FROM USER WHERE TOKEN LIKE ? AND ADMIN = 1;', [token]);
  if (IDRow) {
    return IDRow.ID;
  }
  return 0;
};

/**
 * @returns {Promise<string>} Session token on success, empty string on failure.
 */
exports.login = async function login(email, password) {
  const tokenRow = await dbModule.dbGet('SELECT TOKEN, PASSWORD FROM USER WHERE LOWER(?) LIKE LOWER(EMAIL);', [email]);
  if (!tokenRow) {
    return '';
  }
  const resultToken = await new Promise(function comparePassword(resolve) {
    bcrypt.compare(password, tokenRow.PASSWORD, function onCompare(err2, res) {
      if (res) {
        resolve(tokenRow.TOKEN);
        return;
      }
      resolve('');
    });
  });
  return resultToken;
};

/**
 * Register a client or coach. surveyAnswers[0].inputAnswer is stored as NAME.
 * @returns {Promise<string>} Token on success, empty string if the email exists.
 */
exports.register = async function register(email, password, isCoach, surveyAnswers) {
  const IDRow = await dbModule.dbGet('SELECT ID FROM USER WHERE LOWER(EMAIL) LIKE LOWER(?);', [email]);
  if (IDRow) {
    return '';
  }
  const password2 = await new Promise(function hashPassword(resolve) {
    bcrypt.hash(password, 10, function onHash(err, hash) {
      resolve(hash);
    });
  });
  const token = exports.generateToken();
  const displayName = surveyAnswers && surveyAnswers[0] ? surveyAnswers[0].inputAnswer : '';
  await dbModule.dbRun(
    'INSERT INTO USER (NAME, PROFILEPICTURE, ABOUT, EMAIL, PASSWORD, TOKEN, ISCOACH, COACHID) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
    [displayName, '/resources/default.png', 'Proud Bastion Member since 2023!', email, password2, token, isCoach, -1]
  );
  return token;
};

exports.resetPassword = async function resetPassword(userID, newPassword) {
  const hashedPassword = await new Promise(function hashPassword(resolve) {
    bcrypt.hash(newPassword, 10, function onHash(err, hash) {
      resolve(hash);
    });
  });
  dbModule.dbRun('UPDATE USER SET PASSWORD = ? WHERE ID = ?;', [hashedPassword, userID]);
};
