const helmet = require('helmet');

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

const BACKEND = process.env.BACKEND_URL || 'http://localhost:3000';

const SELF = "'self'";
const NONE = "'none'";

const cspConfig = helmet.contentSecurityPolicy({
  directives: {
    'default-src': [SELF, BACKEND, ...ALLOWED_ORIGINS],
    'script-src':  [SELF, BACKEND, ...ALLOWED_ORIGINS],
    'style-src':   [SELF, BACKEND, ...ALLOWED_ORIGINS],
    'img-src':     [SELF, BACKEND, ...ALLOWED_ORIGINS],
    'media-src':   [SELF, BACKEND, ...ALLOWED_ORIGINS],
    'frame-src':   [SELF, BACKEND, ...ALLOWED_ORIGINS],
    'connect-src': [SELF, BACKEND, ...ALLOWED_ORIGINS],
    'font-src':    [SELF, 'https://fonts.gstatic.com'],
    'object-src':  [SELF, BACKEND, ...ALLOWED_ORIGINS],
    'frame-ancestors': [SELF, BACKEND, ...ALLOWED_ORIGINS],
    'upgrade-insecure-requests': [],
  },
});

module.exports = cspConfig;