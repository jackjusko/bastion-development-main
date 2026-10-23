/**
 * Runtime configuration for the Bastion API.
 *
 * Values come from the environment so local SQLite, production MySQL, and
 * Stripe/AWS credentials can change without editing source.
 */
const path = require('path');
const fs = require('fs');

const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

function env(name, fallback) {
  const value = process.env[name];
  return value === undefined || value === '' ? fallback : value;
}

const sqlitePath = env('SQLITE_PATH', path.join(__dirname, 'data', 'bastionfit.db'));

module.exports = {
  port: parseInt(env('PORT', '8010'), 10),
  publicUrl: env('PUBLIC_URL', 'http://localhost:8010'),
  corsOrigin: env('CORS_ORIGIN', 'http://localhost:3000'),
  databaseDriver: env('DATABASE_DRIVER', 'sqlite'),
  sqlitePath,
  mysql: {
    host: env('MYSQL_HOST', ''),
    user: env('MYSQL_USER', ''),
    password: env('MYSQL_PASSWORD', ''),
    database: env('MYSQL_DATABASE', '')
  },
  stripeSecretKey: env('STRIPE_SECRET_KEY', ''),
  aws: {
    accessKeyId: env('AWS_ACCESS_KEY_ID', ''),
    secretAccessKey: env('AWS_SECRET_ACCESS_KEY', ''),
    region: env('AWS_REGION', 'us-east-2'),
    s3Bucket: env('AWS_S3_BUCKET', 'bastionuploadedresources')
  },
  vueStaticDir: path.join(__dirname, '..', 'frontend-vue'),
  schemaPath: path.join(__dirname, 'schema', 'schema.sql')
};
