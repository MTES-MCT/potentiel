#! /bin/bash -l

if [ "$APPLICATION_STAGE" != "production" ] && [ "$APPLICATION_STAGE" != "development" ]
then
        echo "This job can't be executed on $APPLICATION_STAGE environment"
        exit 0
fi

if [ -z $DATABASE_CONNECTION_STRING ]
then
    echo "Connection is missing!"
    exit 1
fi

echo "Launching job [RELANCER ABANDON SANS PREUVE]"

npm run start:relancer-abandon-sans-preuve -w @potentiel-applications/scheduled-tasks

exit 0