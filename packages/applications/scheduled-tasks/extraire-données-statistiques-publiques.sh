#! /bin/bash -l


if [ -z $DATABASE_CONNECTION_STRING ]
then
    echo "Connection is missing!"
    exit 1
fi

if [ -z $SENTRY_CRONS ] 
then
  echo "A monitoring variable is missing !"
fi

SENTRY_URL=$(echo "$SENTRY_CRONS" | sed 's|<monitor_slug>|extraire-donnees-statistiques-publiques|')
MONITORING_URL="$SENTRY_URL?environment=$APPLICATION_STAGE"

handle_error() {
  local message="Error on 'extraire-donnees-statistiques-publiques' script line $1"
  echo $message

  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  local hostname=$(hostname)

  curl "${MONITORING_URL}&status=error"

  exit 1
}

trap 'handle_error $LINENO' ERR

echo "Launching job [EXTRAIRE DONNÉES STATISTIQUES PUBLIQUES]"

npm run start:extraire-données-statistiques-publiques -w @potentiel-applications/scheduled-tasks

curl "${MONITORING_URL}&status=ok"

exit 0