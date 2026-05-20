import type { S3 } from '@aws-sdk/client-s3';
import { Command, Flags } from '@oclif/core';
import ora from 'ora';
import z from 'zod';

import { fileExists, getBucketName, getClient, upload } from '@potentiel-libraries/file-storage';
import { getLogger, type Logger } from '@potentiel-libraries/monitoring';

import { dbSchema, s3Schema } from '#helpers';

const envSchema = z.object({
  ...dbSchema.shape,
  ...s3Schema.shape,
});

export class MigrerFichiersCommand extends Command {
  #logger!: Logger;
  #s3!: S3;

  static flags = {
    progress: Flags.boolean({ default: false, description: 'display the progress' }),
    recover: Flags.boolean({
      default: false,
      description: 'try to continue work from previous execution, based on last file uploaded',
    }),
    dryRun: Flags.boolean({
      default: false,
      description: 'only list files to migrate without actually migrating them',
    }),
  };

  async init() {
    envSchema.parse(process.env);

    this.#logger = getLogger();
    this.#s3 = getClient();
  }

  private async listAllS3Objects(
    continuationToken?: string,
  ): Promise<{ path: string; size: number }[]> {
    const files = await this.#s3.listObjectsV2({
      Bucket: getBucketName(),
      ContinuationToken: continuationToken,
    });

    const allFiles: { path: string; size: number }[] = [];

    for (const { Key: key, Size: size } of files.Contents ?? []) {
      if (!key) {
        continue;
      }
      allFiles.push({ path: key, size: size ?? -1 });
    }

    // If there are more results, recursively fetch them
    if (files.IsTruncated && files.NextContinuationToken) {
      const nextFiles = await this.listAllS3Objects(files.NextContinuationToken);
      allFiles.push(...nextFiles);
    }

    return allFiles;
  }

  protected async finally(_: Error | undefined) {
    this.#s3?.destroy();
  }

  async run() {
    this.#logger.info('🚀 Listing s3 files');

    const { flags } = await this.parse(MigrerFichiersCommand);

    const allFiles = await this.listAllS3Objects();

    const filesToMigrate = allFiles.filter(
      ({ path }) =>
        !path.startsWith('projects/') && !path.match(/\/candidature\/import\/.*\.json$/),
    );

    const stats = {
      total: filesToMigrate.length,
      ignored: allFiles.length - filesToMigrate.length,
      migrated: 0,
      skipped: 0,
      failed: 0,
    };

    console.log(`📊 ${stats.total} files to migrate. ${stats.ignored} ignored.`);
    const progress = ora('Migrating files...');
    if (flags.progress) {
      progress.start();
    }

    if (flags.dryRun) {
      this.#logger.warn('Dry Run enabled, no files will be migrated, only listed');
      progress.prefixText = '[Dry Run] ';
    }

    for (const file of filesToMigrate) {
      progress.text = `${stats.migrated}/${stats.total} (${Math.round((100 * stats.migrated) / stats.total)}%) migrated, ${stats.skipped} skipped, ${stats.failed} failed. Current file: ${file.path}`;
      const { path } = file;
      if (flags.recover && (await fileExists(path))) {
        stats.skipped++;
        continue;
      }

      const obj = await this.#s3.getObject({ Bucket: getBucketName(), Key: path });
      if (!obj.Body) {
        this.#logger.error(`🚨 No body found for file ${path}`);
        stats.failed++;
        continue;
      }
      if (flags.dryRun) {
        await new Promise((resolve) => setTimeout(resolve, 30));
      } else {
        await upload(path, obj.Body.transformToWebStream());
      }
      stats.migrated++;
    }
    progress.stop();

    this.#logger.info('✅ All done');

    // log stats
    this.#logger.info(`📊 Final stats`, stats);
  }
}
