import { Readable } from 'node:stream';

import { Command, Flags } from '@oclif/core';
import * as z from 'zod';
import { S3 } from '@aws-sdk/client-s3';

import { getLogger, Logger } from '@potentiel-libraries/monitoring';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';

const configSchema = z.object({
  S3_BUCKET: z.string(),
  S3_ENDPOINT: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  DATABASE_CONNECTION_STRING: z.url(),
});

const getFile = async (s3: S3, bucket: string, key: string): Promise<Record<string, string>> => {
  const streamToString = async (stream: Readable): Promise<string> => {
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf-8');
  };

  const file = await s3.getObject({
    Bucket: bucket,
    Key: key,
  });

  if (!file.Body) {
    throw new Error('File body is empty');
  }

  const contentString = await streamToString(file.Body as Readable);

  return JSON.parse(contentString);
};

const valuesToStrip = ['', 'N/A', '#N/A', '0'];

export const removeEmptyValues = (
  obj: Record<string, string | undefined>,
): Record<string, string> =>
  Object.fromEntries(
    Object.entries(obj)
      .filter(([key, value]) => !!key && value !== undefined && !valuesToStrip.includes(value))
      .map(([key, value]) => [key, value as string]),
  );

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
        payload->>'identifiantProjet' AS "identifiantProjet",
        coalesce(
          payload->>'importéLe',
          payload->>'corrigéLe'
        ) AS "dateImport"
      FROM
        event_store.event_stream
      WHERE
        type LIKE 'CandidatureImportée-V%'
        or (
          type like 'CandidatureCorrigée-V%'
          and payload->>'détailsMisÀJour' = 'true'
        )
      order by
        stream_id,
        version;
    `;

    const candidatures = await executeSelect<{
      identifiantProjet: string;
      dateImport: string;
    }>(query);

    this.#logger.info(`ℹ️  Found ${candidatures.length} candidatures`);

    if (!candidatures.length) {
      this.#logger.info('⚠️ No candidature found, exiting');
      return process.exit(1);
    }

    const errors: Array<{ identifiantProjet: string; s3Key: string; error: Error }> = [];
    let count = 1;

    for (const { identifiantProjet: idProjet, dateImport } of candidatures) {
      this.#logger.info(`🔄 Processing ${count} / ${candidatures.length}`);
      const s3Key = `${idProjet}/candidature/import/${dateImport}.json`;

      try {
        const identifiantProjet = IdentifiantProjet.convertirEnValueType(idProjet).formatter();
        const détailRaw = await getFile(this.#s3, this.#s3BucketName, s3Key);

        const event: Candidature.DétailCandidatureImportéEvent = {
          type: 'DétailCandidatureImporté-V1',
          payload: {
            identifiantProjet,
            détail: removeEmptyValues(détailRaw),
            importéLe: DateTime.convertirEnValueType(dateImport).formatter(),
            importéPar: Email.système.formatter(),
          },
        };

        await publish(`candidature|${identifiantProjet}`, event);
        count++;
      } catch (error) {
        errors.push({ identifiantProjet: idProjet, s3Key, error: error as Error });
        count++;
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
