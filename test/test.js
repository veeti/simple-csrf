var express = require('express');
var bodyParser = require('body-parser');
var session = require('cookie-session');
var csrf = require('..');
var assert = require('assert');
var request = require('supertest');

function buildApp() {
  var app = express();
  app.use(bodyParser());
  app.use(session({keys: ['asd']}));
  app.use(csrf());

  app.get('/token', function(req, res) {
    return res.end(req.csrfToken);
  });

  app.post('/test', function(req, res) {
    return res.end('OK');
  });

  return app.listen();
}

// Note: cookies are set manually to work around a bug in Superagent.

describe('simple-csrf', function() {
  it('should accept a valid token through headers', function(done) {
    var agent = request.agent(buildApp());

    agent.get('/token').end(function(err, result) {
      var token = result.text;
      agent.post('/test').set('Cookie', result.headers['set-cookie'].join(';')).set('X-CSRF-Token', token).end(function(err, result) {
        assert.equal(result.statusCode, 200);
        assert.equal(result.text, 'OK');
        done();
      });
    });
  });

  it('should accept a valid token through form', function(done) {
    var agent = request.agent(buildApp());

    agent.get('/token').end(function(err, result) {
      var token = result.text;
      agent.post('/test').set('Cookie', result.headers['set-cookie'].join(';')).send("_csrf_token=" + token).end(function(err, result) {
        assert.equal(result.statusCode, 200);
        assert.equal(result.text, 'OK');
        done();
      });
    });
  });

  it('should not accept an invalid token', function(done) {
    var agent = request.agent(buildApp());

    agent.post('/test').set('X-CSRF-Token', 'nope').end(function(err, result) {
      assert.equal(result.statusCode, 403);
      done();
    });
  });

  it('should require a token', function(done) {
    var agent = request.agent(buildApp());

    agent.post('/test').end(function(err, result) {
      assert.equal(result.statusCode, 403);
      done();
    });
  });
});
