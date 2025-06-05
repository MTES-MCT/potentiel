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

SENTRY_URL=$(echo "$SENTRY_CRONS" | sed 's|<monitor_slug>|backup-3-2-1|')
MONITORING_URL="$SENTRY_URL?environment=$APPLICATION_STAGE"

if [ -z $AWS_ACCESS_KEY_ID ] || [ -z $AWS_SECRET_ACCESS_KEY ] || [ -z $S3_ENDPOINT ] || [ -z $S3_BACKUP_BUCKET ]  || [ -z $SCALINGO_POSTGRESQL_URL ]
then
    echo "An environment variable is missing !!"
    curl "${MONITORING_URL}&status=error"
    exit 1
fi

handle_error() {
  local message="Error on 'backup-3-2-1' script line $1"
  echo $message

  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  local hostname=$(hostname)

  curl "${MONITORING_URL}&status=error"

  exit 1
}

trap 'handle_error $LINENO' ERR

echo "Installing PG utils..."
dbclient-fetcher pgsql

DATE=$(date +"%Y-%m-%d_%H-%M-%S")
echo "Today's date to use in file names is ${DATE}"

echo "Creating compressed backup..."
COMPRESSED_BACKUP_FILE_NAME=dump_${DATE}.pgsql
pg_dump --clean --if-exists --format c --dbname "${SCALINGO_POSTGRESQL_URL}" --no-owner --no-privileges --no-comments --exclude-schema 'information_schema' --exclude-schema '^pg_*' --file ${COMPRESSED_BACKUP_FILE_NAME}

echo Creating plain backup...
PLAIN_BACKUP_FILE_NAME=dump_${DATE}.sql
pg_dump --clean --if-exists --format p --dbname "${SCALINGO_POSTGRESQL_URL}" --no-owner --no-privileges --no-comments --exclude-schema 'information_schema' --exclude-schema '^pg_*' --file ${PLAIN_BACKUP_FILE_NAME}

echo Creating gz archive backup...
TAR_BACKUP_FILE_NAME=dump_${DATE}.tar
GZ_BACKUP_FILE_NAME=${TAR_BACKUP_FILE_NAME}.gz
pg_dump --clean --if-exists --format t --dbname "${SCALINGO_POSTGRESQL_URL}" --no-owner --no-privileges --no-comments --exclude-schema 'information_schema' --exclude-schema '^pg_*' --file ${TAR_BACKUP_FILE_NAME}
gzip ./${TAR_BACKUP_FILE_NAME}

echo "Installing aws cli..."

curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install -i ~/aws-cli -b ~/aws-cli/bin

# https://docs.outscale.com/en/userguide/AWS-SDK-and-CLI-Compatibility-Warning.html#_workarounds
export AWS_REQUEST_CHECKSUM_CALCULATION=WHEN_REQUIRED
export AWS_RESPONSE_CHECKSUM_VALIDATION=WHEN_REQUIRED

cd ~/aws-cli/bin

./aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
./aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
./aws configure set region $AWS_REGION
./aws configure set endpoint_url  $S3_ENDPOINT

echo "Uploading backups to bucket..."

./aws s3 cp ../../${COMPRESSED_BACKUP_FILE_NAME} s3://${S3_BACKUP_BUCKET}/db_backups/${COMPRESSED_BACKUP_FILE_NAME}
./aws s3 cp ../../${PLAIN_BACKUP_FILE_NAME} s3://${S3_BACKUP_BUCKET}/db_backups/${PLAIN_BACKUP_FILE_NAME}
./aws s3 cp ../../${GZ_BACKUP_FILE_NAME} s3://${S3_BACKUP_BUCKET}/db_backups/${GZ_BACKUP_FILE_NAME}

echo "Backup 3-2-1 successfully executed !"

curl "${MONITORING_URL}&status=ok"

exit 0
