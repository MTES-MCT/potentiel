#! /bin/bash -l

if [ "$APPLICATION_STAGE" != "production" ]
then
        echo "This job can't be executed on $APPLICATION_STAGE environment"
        exit 0
fi

if [ -z $EVENT_STORE_CONNECTION_STRING ]
then
    echo "Connection is missing!"
    exit 1
fi

echo "Launching job [EXECUTER TACHES PLANIFIEES]"

npm run start:exécuter-tâches-planifiées -w @potentiel-applications/scheduled-tasks

exit 0