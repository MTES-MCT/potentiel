#! /bin/bash -l

## Install PG utils
dbclient-fetcher pgsql

## Today's date to use in file names
DATE=$(date +"%Y-%m-%d_%H-%M-%S")

## Create compressed backup 
COMPRESSED_BACKUP_FILE_NAME=dump_${DATE}.pgsql
pg_dump --clean --if-exists --format c --dbname "${SCALINGO_POSTGRESQL_URL}" --no-owner --no-privileges --no-comments --exclude-schema 'information_schema' --exclude-schema '^pg_*' --file ${COMPRESSED_BACKUP_FILE_NAME}

## Create plain backup 
PLAIN_BACKUP_FILE_NAME=dump_${DATE}.sql
pg_dump --clean --if-exists --format p --dbname "${SCALINGO_POSTGRESQL_URL}" --no-owner --no-privileges --no-comments --exclude-schema 'information_schema' --exclude-schema '^pg_*' --file ${PLAIN_BACKUP_FILE_NAME}

## Create gz archive backup 
TAR_BACKUP_FILE_NAME=dump_${DATE}.tar
GZ_BACKUP_FILE_NAME=${TAR_BACKUP_FILE_NAME}.gz
pg_dump --clean --if-exists --format t --dbname "${SCALINGO_POSTGRESQL_URL}" --no-owner --no-privileges --no-comments --exclude-schema 'information_schema' --exclude-schema '^pg_*' --file ${TAR_BACKUP_FILE_NAME}
gzip ./${TAR_BACKUP_FILE_NAME}




