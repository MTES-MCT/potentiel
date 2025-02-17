#! /bin/bash -l

if [ -z $EVENT_STORE_CONNECTION_STRING ]
then
    echo "Connection is missing!"
    exit 1
fi

echo "Launching job [EXTRAIRE DONNÉES STATISTIQUES PUBLIQUES]"

npm run start:extraire-données-statistiques-publiques -w @potentiel-applications/scheduled-tasks

exit 0