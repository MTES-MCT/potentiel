#! /bin/bash -l

variables=("S3_BUCKET" "AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY", "S3_SECNUM_BUCKET", "S3_SECNUM_AWS_ACCESS_KEY_ID", "S3_SECNUM_AWS_SECRET_ACCESS_KEY", "APPLICATION_STAGE", "AWS_REGION")

for var_name in "${variables[@]}"
  do
    if [ -z "${!var_name}" ]
    then
        echo "$var_name is missing !"
        exit 1
    fi
  done

if [ "$APPLICATION_STAGE" != "production" ]
then
    echo "This job can't be exeucted on $APPLICATION_STAGE environment"
    exit 0
fi


echo "Launching job [DÉPLACER FICHIERS VERS BUCKET SECNUM]"

npm run start:déplacer-fichiers-vers-bucket-secnum -w @potentiel-applications/scheduled-tasks

exit 0