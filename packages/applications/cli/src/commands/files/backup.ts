import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Command, Flags } from '@oclif/core';
import { z } from 'zod';
import { bulkhead } from 'cockatiel';
import { action } from '@oclif/core/ux';

import { getLogger, Logger } from '@potentiel-libraries/monitoring';
const configSchema = z.object({
  // Source
  S3_BUCKET: z.string(),
  S3_ENDPOINT: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  // Destination
  S3_BACKUP_BUCKET: z.string(),
  S3_BACKUP_ENDPOINT: z.string(),
  S3_BACKUP_AWS_ACCESS_KEY_ID: z.string(),
  S3_BACKUP_AWS_SECRET_ACCESS_KEY: z.string(),
});

export class Backup extends Command {
  #sourceBucketName!: string;
  #destinationBucketName!: string;
  #source!: S3;
  #destination!: S3;
  #logger!: Logger;

  static flags = {
    workers: Flags.integer({ default: 5, description: 'number of upload to make in parallel' }),
    progress: Flags.boolean({ default: false, description: 'display the progress' }),
    recover: Flags.boolean({
      default: false,
      description: 'try to continue work from previous execution, based on last file uploaded',
    }),
  };

  async init() {
    this.#logger = getLogger();

    const config = configSchema.parse(process.env);
    this.#sourceBucketName = config.S3_BUCKET;
    this.#destinationBucketName = config.S3_BACKUP_BUCKET;

    this.#source = new S3({
      endpoint: config.S3_ENDPOINT,
      credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
      },
      region: 'localhost',
      forcePathStyle: true,
    });

    this.#destination = new S3({
      endpoint: config.S3_BACKUP_ENDPOINT,
      credentials: {
        accessKeyId: config.S3_BACKUP_AWS_ACCESS_KEY_ID,
        secretAccessKey: config.S3_BACKUP_AWS_SECRET_ACCESS_KEY,
      },
      region: 'localhost',
      forcePathStyle: true,
    });
  }

  async run() {
    const { flags } = await this.parse(Backup);
    this.#logger.info('🏁 Creating production files backup');

    const startAfter = flags.recover
      ? (await this.getAllFileKeys(this.#destination, this.#destinationBucketName)).pop()
      : undefined;

    const keys = await this.getAllFileKeys(this.#source, this.#sourceBucketName, startAfter);

    if (keys.length < 1) {
      this.#logger.warn('⚠️ No file keys found');
      return;
    }

    const nbFiles = keys.length;
    this.#logger.info(`${nbFiles} files found`);

    action.start('Copying files process');
    let done = 0;
    if (flags.progress) {
      setInterval(() => {
        action.status = `${done}/${nbFiles} - ${Math.round((100 * done) / nbFiles)}%`;
      }, 1000).unref();
    }

    const policy = bulkhead(flags.workers, Infinity);

    await Promise.all(
      keys.map((key) =>
        policy.execute(async () => {
          await this.copyFile(key);
          done++;
        }),
      ),
    );
  }

  async getAllFileKeys(s3: S3, bucket: string, startAfter?: string) {
    this.#logger.info(`ℹ Getting all files from ${bucket}`);
    const fetchFiles = async (startAfter?: string): Promise<string[]> => {
      const { Contents: fileKeys, IsTruncated } = await s3.listObjectsV2({
        Bucket: bucket,
        Prefix: 'projects/',
        StartAfter: startAfter,
      });

      const files = fileKeys?.map((f) => f.Key!) ?? [];
      if (!IsTruncated) {
        return files;
      }
      return files.concat(await fetchFiles(files[files.length - 1]));
    };
    return await fetchFiles(startAfter);
  }

  async copyFile(key: string) {
    try {
      this.#logger.debug(`ℹ Start backuping file`, { key });
      this.#logger.debug(`ℹ Getting file content`, { key });
      const { Body } = await this.#source.getObject({
        Bucket: this.#sourceBucketName,
        Key: key,
      });

      if (Body) {
        await new Upload({
          client: this.#destination,
          params: {
            Bucket: this.#destinationBucketName,
            Key: key,
            Body,
          },
        }).done();

        this.#logger.debug('ℹ Backup done', { key });
      } else {
        this.#logger.warn('⚠️ No content found', { key });
      }
    } catch (e) {
      this.#logger.error(e as Error);
    }
  }
}
