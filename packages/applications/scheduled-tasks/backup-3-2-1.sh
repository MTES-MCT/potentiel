#! /bin/bash -l
CHECK_IN_ID="$(($(date +%s%N)/1000000))"
curl "$SENTRY_CRONS?check_in_id=${CHECK_IN_ID}&status=in_progress&environment=$APPLICATION_STAGE"

handle_error() {
  local message="Error on backup 3-2-1 script line $1"
  echo $message

  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  local hostname=$(hostname)

  curl "$SENTRY_CRONS?check_in_id=${CHECK_IN_ID}&status=error&environment=$APPLICATION_STAGE"

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

cd ~/aws-cli/bin

./aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
./aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
./aws configure set region $AWS_REGION
./aws configure set endpoint_url  $S3_ENDPOINT

echo "Uploading backups to bucket..."

./aws s3 cp ../../${COMPRESSED_BACKUP_FILE_NAME} s3://${S3_BUCKET}/db_backups/${COMPRESSED_BACKUP_FILE_NAME}
./aws s3 cp ../../${PLAIN_BACKUP_FILE_NAME} s3://${S3_BUCKET}/db_backups/${PLAIN_BACKUP_FILE_NAME}
./aws s3 cp ../../${GZ_BACKUP_FILE_NAME} s3://${S3_BUCKET}/db_backups/${GZ_BACKUP_FILE_NAME}

## TODO: Check-in for crons in sentry

echo "Backup 3-2-1 successfully executed !"

curl "$SENTRY_CRONS?check_in_id=${CHECK_IN_ID}&status=ok&environment=$APPLICATION_STAGE"

exit 0
