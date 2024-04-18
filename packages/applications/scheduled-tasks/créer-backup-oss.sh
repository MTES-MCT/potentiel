#! /bin/bash -l

if [ "$APPLICATION_STAGE" != "production" ]
then
        echo "This job can't be exeucted on $APPLICATION_STAGE environment"
        exit 0
fi

echo "Launching job [CRÉER BACKUP OSS]"

npm run build
npm run start:créer-backup-oss

exit 0