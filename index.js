var crypto = require('crypto');
var scmp = require('scmp');

module.exports = function() {
  return function simpleCsrf(req, res, next) {
    // Get/generate token
    var token = req.session.simpleCsrfToken;
    if (!token) {
      token = crypto.randomBytes(32).toString('hex');
      req.session.simpleCsrfToken = token;
    }
    
    // Expose to developer
    req.csrfToken = token;
    res.locals.csrfToken = token;

    // Validate
    if (req.method != 'GET' && req.method != 'HEAD' && req.method != 'OPTIONS') {
      var submittedToken = (req.body && req.body._csrf_token) || (req.headers['x-csrf-token']);
      if (!scmp(submittedToken, token)) {
        var error = new Error('Invalid CSRF token.');
        error.status = 403;
        return next(error);
      }
    }

    next();
  }
};
