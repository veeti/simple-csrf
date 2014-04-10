# simple-csrf

A dead simple CSRF middleware for Express (4.x): uses a single, per-session token with no unnecessary magic and/or tricks.

## Install

    $ npm install simple-csrf

## Usage

Add after you have a session implementation:

```js
var csrf = require('simple-csrf');
app.use(session_of_choice());
app.use(csrf());
```

Validation is performed on requests that are not of type `GET`, `HEAD` or `OPTIONS`. The token is retrieved from either `_csrf_token` in the request body parameters or the `X-CSRF-Token` request header.

The CSRF token is available as `csrfToken` on both the request object, and the renderer view locals.

## License

MIT. See [LICENSE.md](LICENSE.md).