#! /bin/bash -l

if [ "$APPLICATION_STAGE" != "production" ]
then
        echo "This job can't be exeucted on $APPLICATION_STAGE environment"
        exit 0
fi

echo "Launching job [CRÉER BACKUP]"

npm run start:créer-backup -w @potentiel-applications/scheduled-tasks

exit 0