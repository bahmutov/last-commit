#!/bin/bash

set -o xtrace

if [ "$TRAVIS_EVENT_TYPE" = "cron" ]; then
  echo "Upgrading dependencies using next-update"
  npm i -g next-update
  next-update -m ggit --allow patch
  git status
  # if package.json is modified we have
  # new upgrades
  if git diff --name-only | grep package.json > /dev/null; then
    echo "There are new versions of dependencies 💪"
  else
    echo "No new versions found ✋"
  fi
else
  echo "Not a cron job, normal test"
  npm test
fi

