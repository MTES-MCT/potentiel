#! /bin/bash -l

if [ "$APPLICATION_STAGE" != "production" ]
then
        echo "This job can't be executed on $APPLICATION_STAGE environment"
        exit 0
fi

if [ -z $DATABASE_CONNECTION_STRING ]
then
    echo "Connection is missing!"
    exit 1
fi

echo "Launching job [SCHEDULER]"

npm run start -w @potentiel-applications/scheduler

exit 0