/**
 * POST body whitelist. Routes not listed here skip field checks.
 * validateRequest is async because the original contract returned a Promise.
 */
const expectedFields = {
  '/coachJoin': ['firstName', 'lastName', 'location', 'gender', 'about', 'languages', 'attributes', 'specialties', 'accountable', 'compExperience', 'comps', 'circumstances', 'memberships', 'certifications'],
  '/createAccount': ['email', 'password', 'isCoach', 'surveyAnswers'],
  '/login': ['email', 'password'],
  '/updateProfilePicture': ['picture'],
  '/updateAbout': ['about'],
  '/updatePricings': ['COACHID', 'TITLE', 'DESCRIPTION', 'PRICE', 'ID'],
  '/updateCertifications': ['certifications'],
  '/sendOffer': ['clientID', 'planID', 'greeting'],
  '/sendMessage': ['toID', 'message'],
  '/startCoaching': ['offerID'],
  '/adminCancelSubscription': ['clientID'],
  '/forgotPassword': ['email'],
  '/resetPassword': ['password', 'resetToken']
};

/**
 * @param {string} route Request path (originalUrl).
 * @param {object} body Parsed JSON body.
 * @returns {Promise<number>} 1 when valid, 0 when a required field is missing.
 */
exports.validateRequest = function validateRequest(route, body) {
  return new Promise(function (resolve) {
    if (!expectedFields.hasOwnProperty(route)) {
      resolve(1);
      return;
    }
    for (const expectedField of expectedFields[route]) {
      if (!body.hasOwnProperty(expectedField)) {
        resolve(0);
        return;
      }
    }
    resolve(1);
  });
};
