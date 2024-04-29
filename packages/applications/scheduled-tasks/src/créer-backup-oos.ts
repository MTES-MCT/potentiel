import { S3, ListObjectsCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getLogger } from '@potentiel-libraries/monitoring';

const sourceBucketName = process.env.S3_BUCKET || 'potentiel';
const destinationBucketName = process.env.S3_BACKUP_BUCKET || 'backup';

const getAllFileKeys = async (source: S3, nextMarker?: string) => {
  getLogger().info('ℹ Getting all files from production');
  getLogger().info(`ℹ Next marker : ${nextMarker ? 'Yes' : 'No'}`);
  const {
    Contents: fileKeys,
    IsTruncated,
    NextMarker,
  } = await source.send(
    new ListObjectsCommand({
      Bucket: sourceBucketName,
      Marker: nextMarker,
    }),
  );

  let keys = fileKeys ? fileKeys.map((f) => f.Key).filter((f): f is string => f !== undefined) : [];

  if (IsTruncated) {
    getLogger().info(`ℹ List objects is truntaced : ${IsTruncated}`);
    const nextKeys = await getAllFileKeys(source, NextMarker);
    keys = [...keys, ...nextKeys];
  }

  return keys;
};

(async () => {
  getLogger().info('🏁 Creating production files backup');
  const source = new S3({
    endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'minioadmin',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'minioadmin',
    },
    forcePathStyle: true,
  });

  const destination = new S3({
    endpoint: process.env.S3_BACKUP_ENDPOINT || 'http://localhost:9000',
    credentials: {
      accessKeyId: process.env.S3_BACKUP_AWS_ACCESS_KEY_ID || 'minioadmin',
      secretAccessKey: process.env.S3_BACKUP_AWS_SECRET_ACCESS_KEY || 'minioadmin',
    },
    forcePathStyle: true,
  });

  const keys = await getAllFileKeys(source);

  if (keys) {
    for (const key of keys as string[]) {
      getLogger().info('----------');
      try {
        getLogger().info(`ℹ Start backuping file: ${key}`);
        getLogger().info(`ℹ Getting file content`);
        const { Body } = await source.send(
          new GetObjectCommand({
            Bucket: sourceBucketName,
            Key: key,
          }),
        );

        if (Body) {
          await new Upload({
            client: destination,
            params: {
              Bucket: destinationBucketName,
              Key: key,
              Body,
            },
          }).done();

          getLogger().info('ℹ Backup done');
        } else {
          getLogger().warn('⚠️ No content found');
        }
      } catch (e) {
        getLogger().error(e as Error);
      }
      getLogger().info('----------');
    }
  } else {
    getLogger().warn('⚠️ No file keys found');
  }
})();
