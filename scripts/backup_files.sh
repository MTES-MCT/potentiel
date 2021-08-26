#! /bin/bash -l

# Make sure we're only executing this on production
if [[ "$NODE_ENV" != "production" ]]; then
  #echo "CRON: Not production, aborting"
  exit 0
fi

# Make sure this script is not executed multiple times
# (ie check if this is instance #0 and abort on all others)
# see https://www.clever-cloud.com/doc/administrate/cron/
if [[ "$INSTANCE_NUMBER" != "0" ]]; then
  echo "Instance number is ${INSTANCE_NUMBER}. Stop here."
  exit 0
fi

if ! [ -f ./rclone-v1.56.0-linux-amd64/rclone ]
then
  echo "Rclone not found, installing..."
  wget https://downloads.rclone.org/v1.56.0/rclone-v1.56.0-linux-amd64.zip
  unzip rclone-v1.56.0-linux-amd64.zip
else
  echo "Rclone is present, going ahead."
fi

echo "Backing up files..."
./rclone-v1.56.0-linux-amd64/rclone copy --s3-storage-class=GLACIER CCFILES:potentiel-production SW:potentiel-files
echo "Done backing up files!"