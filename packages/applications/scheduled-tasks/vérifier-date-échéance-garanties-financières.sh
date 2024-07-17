#! /bin/bash -l

if [ -z $EVENT_STORE_CONNECTION_STRING ]
then
    echo "Connection is missing!"
    exit 1
fi

echo "Launching job [VERIFIER DATE ÉCHÉANCE DES GARANTIES FINANCIÈRES]"

npm run start:vérifier-date-échéance-garanties-financières -w @potentiel-applications/scheduled-tasks

exit 0
