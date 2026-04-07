import { Command, Flags } from '@oclif/core';
import z from 'zod';

import { getLogger, Logger } from '@potentiel-libraries/monitoring';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { Candidature, Document, IdentifiantProjet } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { DocumentAdapter } from '@potentiel-infrastructure/domain-adapters';

import { dbSchema, s3Schema } from '#helpers';

const envSchema = z.object({
  ...dbSchema.shape,
  ...s3Schema.shape,
});

const valuesToStrip = ['', 'N/A', '#N/A', '0'];

const removeEmptyValues = (obj: Record<string, string | undefined>): Record<string, string> =>
  Object.fromEntries(
    Object.entries(obj)
      .filter(([key, value]) => !!key && value !== undefined && !valuesToStrip.includes(value))
      .map(([key, value]) => [key, value as string]),
  );

const migrateDétailFromS3File = async (
  key: string,
  identifiantProjet: IdentifiantProjet.ValueType,
  dateImport: DateTime.ValueType,
) => {
  try {
    const file = await DocumentAdapter.téléchargerDocumentProjet(key);

    const text = await new Response(file).text();
    const détail = JSON.parse(text);

    const event: Candidature.DétailCandidatureImportéEvent = {
      type: 'DétailCandidatureImporté-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        détail: removeEmptyValues(détail),
        importéLe: dateImport.formatter(),
        importéPar: Email.système.formatter(),
      },
    };

    await publish(`candidature|${identifiantProjet.formatter()}`, event);
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

    await publish(`candidature|${identifiantProjet.formatter()}`, event);
  } catch (error) {
    throw new Error(
      `Failed to migrate détail from legacy database for project ${identifiantProjet.formatter()}: ${(error as Error).message}`,
    );
  }
};

export class RecupererFichiersDetailsCommand extends Command {
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

    envSchema.parse(process.env);

    Document.registerDocumentProjetQueries({
      récupérerDocumentProjet: DocumentAdapter.téléchargerDocumentProjet,
    });
  }

  async run() {
    this.#logger.info('🚀 Getting candidature events');

    const candidatures = await executeSelect<{
      identifiantProjet: string;
      dateImport: string;
    }>(`
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
    `);

    const existingEvents = await executeSelect<{
      identifiantProjet: string;
    }>(`
      SELECT
        payload->>'identifiantProjet' AS "identifiantProjet"
      FROM
        event_store.event_stream
      WHERE
        type = 'DétailCandidatureImporté-V1'
      GROUP BY
        payload->>'identifiantProjet';
    `);

    this.#logger.info(`ℹ️  Found ${candidatures.length} candidatures`);

    if (!candidatures.length) {
      this.#logger.info('⚠️ No candidature found, exiting');
      return process.exit(1);
    }

    const errors: Array<{ identifiantProjet: string; dateImport: string; error: Error }> = [];

    let count = 1;

    for (const { identifiantProjet, dateImport } of candidatures) {
      this.#logger.info(`🔄 Processing ${count} / ${candidatures.length}`);

      if (existingEvents.find((e) => e.identifiantProjet === identifiantProjet)) {
        count++;
        continue;
      }

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
      this.#logger.error('🚨 Some errors occurred during the process:');

      for (const error of errors) {
        this.#logger.error(
          `${error.identifiantProjet} (${error.dateImport}): ${error.error.message}`,
        );
      }
      process.exit(1);
    }
  }
}
