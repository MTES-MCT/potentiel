#! /bin/bash -l

if [ "$APPLICATION_STAGE" != "production" ]
then
  echo "No backup for $APPLICATION_STAGE environment"
  exit 0
fi

if [ -z $SENTRY_CRONS ] || [ -z $APPLICATION_STAGE ]
then
  echo "A monitoring variable is missing !!"
fi

SENTRY_URL=$(echo "$SENTRY_CRONS" | sed 's|<monitor_slug>|s3-backup|')
MONITORING_URL="$SENTRY_URL?environment=$APPLICATION_STAGE"

if [ -z $AWS_ACCESS_KEY_ID ] || [ -z $AWS_SECRET_ACCESS_KEY ] || [ -z $S3_ENDPOINT ] || [ -z $S3_BUCKET ] || [ -z $S3_BACKUP_BUCKET ] 
then
    echo "An environment variable is missing !!"
    curl "${MONITORING_URL}&status=error"
    exit 1
fi

handle_error() {
  local message="Error on 'S3-backup' script line $1"
  echo $message

  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  local hostname=$(hostname)

  curl "${MONITORING_URL}&status=error"

  exit 1
}

trap 'handle_error $LINENO' ERR

echo "Installing aws cli..."

curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip -q awscliv2.zip
./aws/install -i ~/aws-cli -b ~/aws-cli/bin

cd ~/aws-cli/bin

./aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
./aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY

MAX_CHANGED_OBJECTS=2000

echo "Checking number of objects to sync..."

NB_CHANGED_OBJECTS=$(./aws s3 sync s3://$S3_BUCKET s3://$S3_BACKUP_BUCKET --endpoint-url $S3_ENDPOINT --copy-props none --dryrun | wc -l | tr -d ' ')

echo "${NB_CHANGED_OBJECTS} object(s) would be changed"

if [ "$NB_CHANGED_OBJECTS" -gt "$MAX_CHANGED_OBJECTS" ]
then
  echo "Too many objects changed (${NB_CHANGED_OBJECTS} > ${MAX_CHANGED_OBJECTS}), aborting sync"
  curl "${MONITORING_URL}&status=error"
  exit 1
fi

echo "Syncing bucket..."

./aws s3 sync s3://$S3_BUCKET s3://$S3_BACKUP_BUCKET --endpoint-url $S3_ENDPOINT --copy-props none

echo "Bucket successfully synced..."

curl "${MONITORING_URL}&status=ok"

exit 0
