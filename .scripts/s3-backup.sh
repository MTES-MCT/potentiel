#! /bin/bash -l

if [ "$APPLICATION_STAGE" != "production" ]
then
  echo "No backup for $APPLICATION_STAGE environment"
  exit 0
fi

if [ -z "${SENTRY_CRONS:-}" ] || [ -z "${APPLICATION_STAGE:-}" ]
then
  echo "A monitoring variable is missing !!"
fi

SENTRY_URL=$(echo "$SENTRY_CRONS" | sed 's|<monitor_slug>|s3-backup|')
MONITORING_URL="$SENTRY_URL?environment=$APPLICATION_STAGE"

if [ -z "${AWS_ACCESS_KEY_ID:-}" ] || [ -z "${AWS_SECRET_ACCESS_KEY:-}" ] || [ -z "${S3_ENDPOINT:-}" ] || [ -z "${S3_BUCKET:-}" ] || [ -z "${S3_BACKUP_BUCKET:-}" ]
then
    echo "An environment variable is missing !!"
    curl "${MONITORING_URL}&status=error"
    exit 1
fi


handle_error() {
  local message="Error on 'S3-backup' script line $1"
  echo "$message"

  curl "${MONITORING_URL}&status=error"

  exit 1
}

trap 'handle_error $LINENO' ERR

echo "Installing rclone..."

curl -fsSL "https://downloads.rclone.org/rclone-current-linux-amd64.zip" -o "rclone.zip"
unzip rclone.zip -d ./rclone
alias rclone=$(find ./rclone -name "rclone" -type f -executable)

echo "Configuring rclone..."
rclone config create prod s3 env_auth=true provider Outscale endpoint "$S3_ENDPOINT"

echo "Syncing bucket..."

rclone copy "prod:$S3_BUCKET" "prod:$S3_BACKUP_BUCKET"

echo "Bucket successfully synced..."

curl "${MONITORING_URL}&status=ok"

exit 0
