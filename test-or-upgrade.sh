#!/bin/bash

if [ "$TRAVIS_EVENT_TYPE" = "cron" ]; then
  echo "Upgrading dependencies using next-update"
  npm i -g next-update
  next-update -m ggit --allow patch
  git status
else
  echo "Not a cron job, normal test"
  npm test
fi

