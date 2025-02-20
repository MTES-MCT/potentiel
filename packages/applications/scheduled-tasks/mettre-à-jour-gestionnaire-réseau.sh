#! /bin/bash -l

if [ -z $DATABASE_CONNECTION_STRING ]
then
    echo "Connection is missing!"
    exit 1
fi

if [ -z $ORE_ENDPOINT ]
then
    echo "Ore endpoint is missing!"
    exit 1
fi

echo "Launching job [METTRE A JOUR GESTIONNAIRE RESEAU]"

npm run start:mettre-à-jour-gestionnaire-réseau -w @potentiel-applications/scheduled-tasks

exit 0
