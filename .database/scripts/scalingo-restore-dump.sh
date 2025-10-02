# This script runs for scalingo review apps, triggered by the "first-deploy" script in scalingo.json

set -e
set -u

if [[ "$APPLICATION_NAME" == *"production"* ]]; then
  echo "❌ This script cannot be run in production environment"
  exit 1
fi

dbclient-fetcher pgsql

if [ -f "./.database/potentiel-dev.dump" ]; then
	pg_restore -d "$POSTGRES_USER" < ./.database/potentiel-dev.dump
	echo "✨ Potentiel Database has been restored with potentiel-dev dump file✨"
else
	echo "❌ Potentiel database dump file not found"
fi
