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

echo "Launching job [METTRE A JOUR GESTIONNAIRE RESEAU]"

npm run build
npm run start:maj-gestionnaire-réseau

exit 0
