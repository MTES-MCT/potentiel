#! /bin/bash -l

if [ "$APPLICATION_STAGE" != "production" ] && [ "$APPLICATION_STAGE" != "development" ]
then
        echo "This job can't be exeucted on $APPLICATION_STAGE environment"
        exit 0
fi

if [ -z $EVENT_STORE_CONNECTION_STRING ]
then
    echo "Connection is missing!"
    exit 1
fi

echo "Launching job [METTRE A JOUR GESTIONNAIRE RESEAU]"

npm run build
npm run start:maj-gestionnaire-réseaux

exit 0