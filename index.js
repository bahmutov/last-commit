#!/usr/bin/env node

const la = require('lazy-ass');
var check = require('check-more-types');
var ggit = require('ggit');

// assuming the commit id saved using ggit-last command
// https://github.com/bahmutov/ggit/blob/master/bin/ggit-last

var DEFAULT_COMMIT_ID = 'unknown';
var BUILD_FILENAME = 'build.json';
var SHORT_LENGTH = 7;

function formatId(id) {
  la(check.commitId(id), 'expected full commit id', id);
  var shortCommitId = id.substr(0, SHORT_LENGTH);
  // console.log('set last commit id to %s from long %s', shortCommitId, id);
  return shortCommitId;
}

function shortenId(id) {
  if (check.commitId(id)) {
    return formatId(id);
  }
  return id;
}

function readGitLog() {
  return Promise.resolve(ggit.lastCommitId());
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

function fullFilename() {
  var absolute = require('path').resolve;
  var filename = absolute(BUILD_FILENAME);
  return filename;
}

function getHerokuCommit() {
  if (process.env.SOURCE_VERSION &&
    check.unemptyString(process.env.SOURCE_VERSION)) {
    return process.env.SOURCE_VERSION;
  }
}

function loadLastCommitId() {
  var envCommitId = getHerokuCommit();
  if (check.unemptyString(envCommitId)) {
    return Promise.resolve(envCommitId).then(shortenId);
  }

  return readGitLog()
    .catch(function noGitRepo() {
      console.log('could not find git repo, trying file');
      var filename = fullFilename();
      var id = loadCommitIdFromFile(filename);
      return id;
    })
    .then(shortenId)
    .then(returnDefault);
}
module.exports = loadLastCommitId;

function isRunningStandAlone() {
  return !module.parent;
}

if (isRunningStandAlone()) {
  loadLastCommitId()
    .then(console.log.bind(console))
    .catch(console.error);
  /*
  ggit.lastCommitId({ file: BUILD_FILENAME })
    .then(function (id) {
      la(check.commitId(id), 'could not get last commit id from repo', id);
    })
    .done();
  */
}

