#!/usr/bin/env bash
# This script restores a database dump for a test environment or review app.
# For Scalingo review apps, it is automatically triggered by the "first-deploy" script in scalingo.json

set -e
set -u

if [[ "$APPLICATION_NAME" == *"production"* ]]; then
  echo "❌ This script cannot be run in production environment"
  exit 1
fi

dbclient-fetcher pgsql 16

if [ -f "./.database/potentiel-dev.dump" ]; then
	pg_restore --clean --no-acl --no-owner -d $SCALINGO_POSTGRESQL_URL < ./.database/potentiel-dev.dump
	echo "✨ Potentiel Database has been restored with potentiel-dev dump file✨"
else
	echo "❌ Potentiel database dump file not found"
fi
