import { S3, ListObjectsCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getLogger } from '@potentiel-libraries/monitoring';

const sourceBucketName = process.env.S3_BUCKET || '';
const destinationBucketName = process.env.S3_BACKUP_BUCKET || '';

(async () => {
  getLogger().info('🏁 Creating production files backup');
  const backupDate = new Date();
  const source = new S3({
    endpoint: process.env.S3_ENDPOINT || '',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
    forcePathStyle: true,
  });

  const destination = new S3({
    endpoint: process.env.S3_BACKUP_ENDPOINT || '',
    credentials: {
      accessKeyId: process.env.S3_BACKUP_AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_BACKUP_AWS_SECRET_ACCESS_KEY || '',
    },
    forcePathStyle: true,
  });

  getLogger().info('ℹ Getting all files from production');
  const { Contents: fileKeys } = await source.send(
    new ListObjectsCommand({
      Bucket: sourceBucketName,
    }),
  );

  const keys = fileKeys?.map((f) => f.Key).filter((f) => f !== undefined);

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
              Key: `${backupDate.toISOString()}/${key}`,
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
