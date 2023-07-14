import { S3 } from 'aws-sdk';

const stagingBucketName = '';
const stagingClient = new S3({
  endpoint: '',
  accessKeyId: '',
  secretAccessKey: '',
  s3ForcePathStyle: true,
});

type S3File = {
  key: string;
  lastModified: Date;
  eTag: string;
};

export const getAllStagingFiles = async (): Promise<S3File[]> => {
  const allFiles: Array<S3File> = [];
  let isTruncated = true;
  let marker = '';

  while (isTruncated) {
    const files = await stagingClient
      .listObjects({ Bucket: stagingBucketName, Marker: marker })
      .promise();

    if (!files.Contents || files.Contents.length === 0 || !files.Contents[0].Key) {
      continue;
    }

    allFiles.push(
      ...files.Contents.map(
        (file) => ({ key: file.Key, lastModified: file.LastModified, eTag: file.ETag } as S3File),
      ),
    );

    isTruncated = files.IsTruncated ?? false;

    if (files.IsTruncated) {
      marker = files.Contents?.pop()?.Key ?? '';
    }
  }

  return allFiles;
};

export const getStagingObject = async (key: string) => {
  try {
    return await stagingClient
      .headObject({
        Bucket: stagingBucketName,
        Key: key,
      })
      .promise();
  } catch (error) {
    if (error.code === 'NotFound') {
      return undefined;
    }
    const message = `❌ getStagingObject ${key} - error: ${error}`;
    throw new Error(message);
  }
};

export const updateStagingFile = async (key: string, body: S3.Body | undefined) => {
  try {
    return await stagingClient.putObject({
      Bucket: stagingBucketName,
      Key: key,
      Body: body,
    });
  } catch (error) {
    const message = `❌ updateStagingFile ${key} - error: ${error}`;
    throw new Error(message);
  }
};

export const uploadStagingFile = async (key: string, body: S3.Body | undefined) => {
  try {
    return await stagingClient
      .upload({
        Bucket: stagingBucketName,
        Key: key,
        Body: body,
      })
      .promise();
  } catch (error) {
    const message = `❌ uploadStagingFile ${key} - error: ${error}`;
    throw new Error(message);
  }
};

export const deleteStagingFile = async (key: string) => {
  try {
    return await stagingClient
      .deleteObject({
        Bucket: stagingBucketName,
        Key: key,
      })
      .promise();
  } catch (error) {
    const message = `❌ deleteStagingFile ${key} - error: ${error}`;
    throw new Error(message);
  }
};
