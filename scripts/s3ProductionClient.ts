import { S3 } from 'aws-sdk';

const productionBucketName = '';
const productionClient = new S3({
  endpoint: '',
  accessKeyId: '',
  secretAccessKey: '',
  s3ForcePathStyle: true,
});

type S3File = {
  key: string;
  lastModified: Date;
};

export const getAllProductionFiles = async (): Promise<S3File[]> => {
  const allFiles: Array<S3File> = [];
  let isTruncated = true;
  let marker = '';

  while (isTruncated) {
    const files = await productionClient
      .listObjects({ Bucket: productionBucketName, Marker: marker })
      .promise();

    if (!files.Contents || files.Contents.length === 0 || !files.Contents[0].Key) {
      continue;
    }

    allFiles.push(
      ...files.Contents.map(
        (file) => ({ key: file.Key, lastModified: file.LastModified } as S3File),
      ),
    );

    isTruncated = files.IsTruncated ?? false;

    if (files.IsTruncated) {
      marker = files.Contents?.pop()?.Key ?? '';
    }
  }

  return allFiles;
};

export const downloadProductionFile = async (key: string) => {
  try {
    const result = await productionClient
      .getObject({ Bucket: productionBucketName, Key: key })
      .promise();

    return result.Body;
  } catch (error) {
    console.log(`❌ downloadProductionFile error: ${error}`);
    throw error;
  }
};
