import { S3 } from 'aws-sdk';

const stagingBucketName = '';
const stagingClient = new S3({
  endpoint: '',
  accessKeyId: '',
  secretAccessKey: '',
  s3ForcePathStyle: true,
});

export const getStagingObject = (key: string) => {
  try {
    return stagingClient
      .headObject({
        Bucket: stagingBucketName,
        Key: key,
      })
      .promise();
  } catch (error) {
    if (error.code === 'NotFound') {
      return undefined;
    }
    console.log(`❌ getStagingObject error: ${error}`);
    throw error;
  }
};

export const updateStagingFile = (key: string, body: S3.Body | undefined) => {
  try {
    return stagingClient.putObject({
      Bucket: stagingBucketName,
      Key: key,
      Body: body,
    });
  } catch (error) {
    console.log(`❌ updateStagingFile error: ${error}`);
    throw error;
  }
};

export const uploadStagingFile = (key: string, body: S3.Body | undefined) => {
  try {
    return stagingClient
      .upload({
        Bucket: stagingBucketName,
        Key: key,
        Body: body,
      })
      .promise();
  } catch (error) {
    console.log(`❌ uploadStagingFile error: ${error}`);
    throw error;
  }
};
