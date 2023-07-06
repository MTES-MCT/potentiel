#! /bin/bash -l

if [ $APPLICATION_STAGE != 'production'] then
    exit 0
fi

if [ -z $AWS_ACCESS_KEY_ID ] && [ -z $AWS_SECRET_ACCESS_KEY ] && [ -z $S3_ENDPOINT] && [ -z $S3_BUCKET] && [ -z $S3_BACKUP_BUCKET]; then
    echo "An environment variable is missing !!"
    exit 1
fi

curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install

aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
aws s3 sync s3://$S3_BUCKET s3://$S3_BACKUP_BUCKET --endpoint-url $S3_ENDPOINT

if [ -z $LEGACY_AWS_ACCESS_KEY_ID ] && [ -z $LEGACY_AWS_SECRET_ACCESS_KEY ] && [ -z $LEGACY_S3_ENDPOINT] && [ -z $LEGACY_S3_BUCKET] && [ -z $LEGACY_S3_BACKUP_BUCKET]; then
    echo "An environment variable is missing !!"
    exit 1
fi

aws configure set aws_access_key_id $LEGACY_S3_ACCESS_KEY_ID
aws configure set aws_secret_access_key $LEGACY_S3_SECRET_ACCESS_KEY
aws s3 sync s3://$LEGACY_S3_BUCKET s3://$LEGACY_S3_BACKUP_BUCKET --endpoint-url $LEGACY_S3_ENDPOINT

exit 0