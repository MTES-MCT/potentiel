#! /bin/bash -l

if [ "$APPLICATION_STAGE" != "production" ]
then
        echo "No backup for $APPLICATION_STAGE environment"
        exit 0
fi

if [ -z $EVENT_STORE_CONNECTION_STRING ] || [ -z $MJ_APIKEY_PUBLIC ] || [ -z $MJ_APIKEY_PRIVATE ]
then
    echo "An environment variable is missing !!"
    exit 1
fi

echo "Launching job [RELANCER ABANDON SANS PREUVE]"

npm exec ts-node-dev ./scripts/cron/relancer-abandon-sans-preuve.ts"

exit 0