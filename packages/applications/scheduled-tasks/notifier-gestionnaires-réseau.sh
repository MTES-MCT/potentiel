#! /bin/bash -l

if [ -z $DATABASE_CONNECTION_STRING ]
then
    echo "Connection is missing!"
    exit 1
fi

echo "Launching job [NOTIFIER GESTIONNAIRES RESEAU]"

npm run start:notifier-gestionnaires-réseau -w @potentiel-applications/scheduled-tasks

exit 0
