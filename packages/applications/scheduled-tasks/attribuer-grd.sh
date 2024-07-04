#! /bin/bash -l

if [ -z $EVENT_STORE_CONNECTION_STRING ]
then
    echo "Connection is missing!"
    exit 1
fi

if [ -z $ORE_ENDPOINT ]
then
    echo "Ore endpoint is missing!"
    exit 1
fi

echo "Launching job [ATTRIBUER GRD]"

npm run start:start:attribuer-grd -w @potentiel-applications/scheduled-tasks

exit 0
