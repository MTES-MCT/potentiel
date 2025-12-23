import { dirname, join } from 'path';
import { mkdir, writeFile } from 'fs/promises';

import { Command, Flags } from '@oclif/core';
import * as z from 'zod';
import { S3 } from '@aws-sdk/client-s3';

import { getLogger, Logger } from '@potentiel-libraries/monitoring';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

const configSchema = z.object({
  S3_BUCKET: z.string(),
  S3_ENDPOINT: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  DATABASE_CONNECTION_STRING: z.url(),
});

export class RecupererFichiersDetailsCommand extends Command {
  #s3!: S3;
  #s3BucketName!: string;
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

    this.#s3BucketName = config.S3_BUCKET;

    this.#s3 = new S3({
      endpoint: config.S3_ENDPOINT,
      credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
      },
      region: 'localhost',
      forcePathStyle: true,
    });
  }

  async run() {
    this.#logger.info('🚀 Getting candidature events');

    const query = `
      SELECT 
        es1.payload->>'identifiantProjet' AS "identifiantProjet",
        es1.payload->>'importéLe' AS "dateImport",
        CASE 
          WHEN COUNT(es2.payload->>'corrigéLe') = 0 THEN NULL
          ELSE ARRAY_AGG(es2.payload->>'corrigéLe' ORDER BY es2.payload->>'corrigéLe' ASC)
        END AS "datesCorrection"
      FROM 
        event_store.event_stream es1
      LEFT JOIN 
        event_store.event_stream es2 
      ON 
        es1.payload->>'identifiantProjet' = es2.payload->>'identifiantProjet'
        AND es2.type LIKE 'CandidatureCorrigée-V%'
      WHERE 
        es1.type LIKE 'CandidatureImportée-V%'
      GROUP BY 
        es1.payload->>'identifiantProjet', 
        es1.payload->>'importéLe';
    `;

    const candidatures = await executeSelect<{
      identifiantProjet: string;
      dateImport: string;
      datesCorrection?: string[];
    }>(query);

    this.#logger.info(`ℹ️  Found ${candidatures.length} candidatures`);

    if (!candidatures.length) {
      this.#logger.info('⚠️ No candidature found, exiting');
      return process.exit(1);
    }

    const errors: Array<{ identifiantProjet: string; error: Error }> = [];

    for (const { identifiantProjet, dateImport, datesCorrection } of candidatures) {
      try {
        await getFile({
          s3Key: `${identifiantProjet}/candidature/import/${dateImport}.json`,
          s3: this.#s3,
          s3Bucket: this.#s3BucketName,
          filePath: `${identifiantProjet}/candidature/import/${dateImport}.json`,
        });
      } catch (error) {
        errors.push({ identifiantProjet, error: error as Error });
      }

      if (!datesCorrection) {
        continue;
      }

      for (const dateCorrection of datesCorrection) {
        try {
          await getFile({
            s3Key: `${identifiantProjet}/candidature/import/${dateCorrection}.json`,
            s3: this.#s3,
            s3Bucket: this.#s3BucketName,
            filePath: `${identifiantProjet}/candidature/correction/${dateCorrection}.json`,
          });
        } catch (error) {
          errors.push({ identifiantProjet, error: error as Error });
        }
      }
    }

    this.#logger.info('✅  All done');

    if (errors.length) {
      this.#logger.error('Some errors occurred during the process:');
      errors.forEach(({ identifiantProjet, error }) => {
        this.#logger.error(`- ${identifiantProjet}: ${error.message}`);
      });
      process.exit(1);
    }
  }
}

type GetFileProps = {
  s3Key: string;
  s3: S3;
  s3Bucket: string;
  filePath: string;
};

const getFile = async ({ s3Key, s3, s3Bucket, filePath }: GetFileProps) => {
  const path = join(__dirname, '.files', filePath);

  // Check if the file already exists
  try {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, '', { flag: 'wx' });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'EEXIST') {
      throw new Error(`File already exists at path ${path}`);
    }
    throw err;
  }

  const object = await s3.getObject({
    Bucket: s3Bucket,
    Key: s3Key,
  });

  if (!object.Body) {
    throw new Error(`No file found for key ${s3Key}`);
  }

  const dirPath = dirname(path);

  // Ensure the directory exists
  await mkdir(dirPath, { recursive: true });

  // Write the file content
  const fileContent = await object.Body.transformToString();
  await writeFile(path, fileContent, 'utf-8');

  setTimeout(() => {
    console.log(`✅  File saved at ${path}`);
  }, 200);
};
