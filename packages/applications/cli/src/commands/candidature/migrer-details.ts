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

const valuesToStrip = ['', 'N/A', '#N/A', '0'];

const removeEmptyValues = (obj: Record<string, string | undefined>): Record<string, string> =>
  Object.fromEntries(
    Object.entries(obj)
      .filter(([key, value]) => !!key && value !== undefined && !valuesToStrip.includes(value))
      .map(([key, value]) => [key, value as string]),
  );

// const verifyEventNotExists = async (
//   identifiantProjet: IdentifiantProjet.ValueType,
//   dateImport: DateTime.ValueType,
// ): Promise<boolean> => {
//   const existingEvent = await executeSelect<{
//     exists?: string;
//   }>(
//     `
//       SELECT 1
//       FROM event_store.event_stream
//       WHERE
//         type = 'DétailCandidatureImporté-V1'
//         AND payload->>'identifiantProjet' = $1
//         AND payload->>'importéLe' = $2
//       LIMIT 1;
//     `,
//     identifiantProjet.formatter(),
//     dateImport.formatter(),
//   );

//   return existingEvent.length === 0;
// };

const migrateDétailFromS3File = async (
  s3: S3,
  bucket: string,
  key: string,
  identifiantProjet: IdentifiantProjet.ValueType,
  dateImport: DateTime.ValueType,
) => {
  try {
    // const existingEvent = await verifyEventNotExists(identifiantProjet, dateImport);

    // if (existingEvent) {
    //   throw new Error(
    //     `Event already exists for project ${identifiantProjet.formatter()} on ${dateImport.formatter()}`,
    //   );
    // }

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
    const détail = JSON.parse(contentString);

    const event: Candidature.DétailCandidatureImportéEvent = {
      type: 'DétailCandidatureImporté-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        détail: removeEmptyValues(détail),
        importéLe: dateImport.formatter(),
        importéPar: Email.système.formatter(),
      },
    };

    await publish(`candidature|${identifiantProjet}`, event);
  } catch (error) {
    throw new Error(
      `Failed to migrate détail from S3 file ${key} for project ${identifiantProjet.formatter()}: ${(error as Error).message}`,
    );
  }
};

const migrateDétailFromLegacyDatabase = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  dateImport: DateTime.ValueType,
) => {
  try {
    // const existingEvent = await verifyEventNotExists(identifiantProjet, dateImport);

    // if (existingEvent) {
    //   throw new Error(
    //     `Event already exists for project ${identifiantProjet.formatter()} on ${dateImport.formatter()}`,
    //   );
    // }

    const details = await executeSelect<{ details: Record<string, string> }>(
      `select details from projects where "appelOffreId" = $1 and "periodeId" = $2 and "familleId" = $3 and "numeroCRE" = $4 limit 1;`,
      identifiantProjet.appelOffre,
      identifiantProjet.période,
      identifiantProjet.famille,
      identifiantProjet.numéroCRE,
    );

    if (details.length === 0) {
      throw new Error(`No details found for project ${identifiantProjet.formatter()}`);
    }

    const détail = details[0].details;

    const event: Candidature.DétailCandidatureImportéEvent = {
      type: 'DétailCandidatureImporté-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        détail: removeEmptyValues(détail),
        importéLe: dateImport.formatter(),
        importéPar: Email.système.formatter(),
      },
    };

    await publish(`candidature|${identifiantProjet}`, event);
  } catch (error) {
    throw new Error(
      `Failed to migrate détail from legacy database for project ${identifiantProjet.formatter()}: ${(error as Error).message}`,
    );
  }
};

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

    const errors: Array<{ identifiantProjet: string; dateImport: string; error: Error }> = [];

    let count = 1;

    for (const { identifiantProjet, dateImport } of candidatures) {
      this.#logger.info(`🔄 Processing ${count} / ${candidatures.length}`);

      try {
        const identifiantProjetValueType =
          IdentifiantProjet.convertirEnValueType(identifiantProjet);
        const dateImportValueType = DateTime.convertirEnValueType(dateImport);

        const idProjet = identifiantProjetValueType.formatter();

        if (idProjet.startsWith('PPE2 - Neutre#2') || idProjet.startsWith('PPE2 - Bâtiment#2')) {
          await migrateDétailFromLegacyDatabase(identifiantProjetValueType, dateImportValueType);
          count++;
          continue;
        }

        await migrateDétailFromS3File(
          this.#s3,
          this.#s3BucketName,
          `${idProjet}/candidature/import/${dateImport}.json`,
          identifiantProjetValueType,
          dateImportValueType,
        );
        count++;
      } catch (error) {
        errors.push({ identifiantProjet, dateImport, error: error as Error });
        count++;
      }
    }

    this.#logger.info('✅  All done');

    if (errors.length) {
      this.#logger.error('Some errors occurred during the process:');
      errors.forEach(({ identifiantProjet, dateImport, error }) => {
        this.#logger.error(`- ${identifiantProjet} (${dateImport}): ${error.message}`);
      });
      process.exit(1);
    }
  }
}
