require('lazy-ass');
var check = require('check-more-types');
var ggit = require('ggit');
var Promise = require('bluebird');

// assuming the commit id saved using ggit-last command
// https://github.com/bahmutov/ggit#lastcommitid

var DEFAULT_COMMIT_ID = 'unknown';
var BUILD_FILENAME = 'build.json';

function formatId(id) {
  la(check.commitId(id), 'expected full commit id', id);
  var shortCommitId = id.substr(0, 7);
  console.log('set last commit id to %s from long %s', shortCommitId, id);
  return shortCommitId;
}

function shortenId(id) {
  if (check.commitId(id)) {
    return formatId(id);
  }
  return id;
}

function tryGitLog(id) {
  if (!id) {
    return ggit.lastCommitId();
  }
  return id;
}

function loadCommitIdFromFile(filename) {
  la(check.unemptyString(filename),
    'expected filename of file with commit id', filename);
  var exists = require('fs').existsSync;
  if (exists(filename)) {
    var build = require(filename);
    la(check.unemptyString(build.id),
      'expected commit id in build file', filename, build);
    return build.id;
    // anywhere in the controller that renders a view just add one more variable
    /* example:
      res.render('home', {
        title: 'Home',
        commit: req.app.get('commit') || 'unknown'
      });
    */
  }
}

function returnDefault(id) {
  return check.unemptyString(id) ? id : DEFAULT_COMMIT_ID;
}

function loadLastCommitId() {
  var join = require('path').join;
  var filename = join(__dirname, '..', BUILD_FILENAME);
  var id = loadCommitIdFromFile(filename);
  return Promise.resolve(id)
    .then(tryGitLog)
    .then(shortenId)
    .then(returnDefault);
}
module.exports = loadLastCommitId;
