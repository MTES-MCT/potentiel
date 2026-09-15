#!/usr/bin/env bash
# This script restores an empty database dump for a test environment.

set -e
set -u

if [[ "$APPLICATION_NAME" == *"production"* ]]; then
  echo "❌ This script cannot be run in production environment"
  exit 1
fi

dbclient-fetcher pgsql 16

DB_URL=$SCALINGO_POSTGRESQL_URL

if [[ "$DB_URL" == *"sslmode=verify-full"* ]]; then
  DB_URL="${DB_URL}&sslrootcert=system"
fi

if [ -f "./.database/potentiel-dev-empty.dump" ]; then
  pg_restore --clean --no-acl --no-owner -d $DB_URL < ./.database/potentiel-dev-empty.dump
	echo "✨ Potentiel Database has been restored with potentiel-dev-empty dump file✨"
else
	echo "❌ Potentiel database empty dump file not found"
fi