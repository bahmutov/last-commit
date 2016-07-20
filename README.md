# last-commit

> Save / read last git commit id from file or from git log

[![NPM][last-commit-icon] ][last-commit-url]

[![Build status][last-commit-ci-image] ][last-commit-ci-url]
[![semantic-release][semantic-image] ][semantic-url]

Often we need to [embed last commit id](http://glebbahmutov.com/blog/embed-version-info/)
into the server information to enable efficient debugging. Since the code is often executed
on a separate instance without the any Git information (like Heroku), we need other means
for saving the last commit repo. I suggest in [this blog][1]
saving the commit id into a separate file during the CI build and then sending the file
to the hosting environment where it can be loaded on startup.

This package can do both: save and read the last commit.

### install

    npm install --save last-commit

## Save

Run this module as a stand alone tool using NPM script to save the last git commit id

```json
"scripts": {
    "last": "last-commit"
}
```

    npm run last

This will create the `build.json` file with the last commit id. Deploy it with the
rest of the code (See [1][1] how) and read it when starting the application

## Read

When starting the application, use this module's exported function that will try:

* get last commit using git
* read from `build.json`

In both cases shorten id will be returned, but the `build.json` will contain the
full one.

Example: embed the commit id in the Express server

```js
var getLastCommitId = require('last-commit');
getLastCommitId()
  .tap(function setCommitId(id) {
    app.set('commit', id);
  })
```

[1]: http://glebbahmutov.com/blog/deployed-commit/

### Heroku

If running on Heroku, the last deployed commit SHA is [available](https://devcenter.heroku.com/changelog-items/630)
under `SOURCE_VERSION` variable. This module will return it if found.

### Small print

Author: Gleb Bahmutov &copy; 2015

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://glebbahmutov.com/blog/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/last-commit/issues) on Github

## MIT License

Copyright (c) 2015 Gleb Bahmutov

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[last-commit-icon]: https://nodei.co/npm/last-commit.svg?downloads=true
[last-commit-url]: https://npmjs.org/package/last-commit
[last-commit-ci-image]: https://travis-ci.org/bahmutov/last-commit.svg?branch=master
[last-commit-ci-url]: https://travis-ci.org/bahmutov/last-commit
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
