/**
 * Profile and review image uploads to S3.
 * Without AWS credentials, callers get the local default avatar path.
 */
const AWS = require('aws-sdk');
const authModule = require('./auth');
const config = require('../config');

if (config.aws.accessKeyId) {
  AWS.config.update({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    region: config.aws.region
  });
}

const s3Bucket = config.aws.accessKeyId
  ? new AWS.S3({ params: { Bucket: config.aws.s3Bucket } })
  : null;

function putImage(base64string) {
  return new Promise(function (resolve) {
    if (!s3Bucket) {
      resolve('/resources/default.png');
      return;
    }
    const dataKey = authModule.generateToken() + '.png';
    const buf = Buffer.from(base64string, 'base64');
    s3Bucket.putObject({
      Key: dataKey,
      Body: buf,
      ContentEncoding: 'base64',
      ContentType: 'image/png'
    }, function (err) {
      if (err) {
        console.log(err);
        resolve('/resources/default.png');
        return;
      }
      resolve(`https://${config.aws.s3Bucket}.s3.${config.aws.region}.amazonaws.com/${dataKey}`);
    });
  });
}

exports.uploadProfilePicture = function uploadProfilePicture(base64string) {
  return putImage(base64string);
};

exports.uploadPicture = function uploadPicture(base64string) {
  return putImage(base64string);
};
