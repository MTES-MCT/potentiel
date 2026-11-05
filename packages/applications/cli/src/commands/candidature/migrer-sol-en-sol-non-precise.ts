import { writeFile } from 'node:fs/promises';

import { Command } from '@oclif/core';

import type { IdentifiantProjet } from '@potentiel-domain/projet';
import { ExportCSV } from '@potentiel-libraries/csv';
import { executeQuery, executeSelect } from '@potentiel-libraries/pg-helpers';

import { dbSchema } from '#helpers';

type StreamId = `installation|${IdentifiantProjet.RawType}`;

type EventType = 'InstallationImportée-V1' | 'CandidatureImportée-V2';

type Stats = {
  total: number;
  sucess: Array<{
    streamId: StreamId;
    event: EventType;
  }>;
  errors: Array<{ streamId: StreamId; event: EventType; message: string }>;
};

export class MigrerSolEnSolNonPrecise extends Command {
  async init() {
    dbSchema.parse(process.env);
  }
  async run() {
    const stats: Stats = {
      total: 0,
      sucess: [],
      errors: [],
    };

    try {
      const eventsInstallationImportée = await executeSelect<{
        streamId: StreamId;
        type: 'InstallationImportée-V1';
        version: number;
      }>(`
          SELECT 
            DISTINCT stream_id as "streamId", 
            type, 
            version
          FROM 
            event_store.event_stream 
          WHERE 
            type = 'InstallationImportée-V1' and 
            payload->'typologieInstallation' @> '[{"typologie": "sol"}]';
      `);

      const eventsCandidatureImportée = await executeSelect<{
        streamId: StreamId;
        type: 'CandidatureImportée-V2';
        version: number;
      }>(`
          SELECT 
            DISTINCT stream_id as "streamId", 
            type, 
            version 
          FROM 
            event_store.event_stream 
          WHERE 
            type = 'CandidatureImportée-V2' and 
            payload->'typologieInstallation' @> '[{"typologie": "sol"}]';
      `);

      if (!eventsInstallationImportée.length) {
        console.info(`ℹ️ Aucun event InstallationImportée avec une typologie 'sol'`);
      }

      if (!eventsCandidatureImportée.length) {
        console.info(`ℹ️ Aucun event CandidatureImportée avec une typologie 'sol'`);
      }

      if (!eventsInstallationImportée.length && !eventsCandidatureImportée.length) {
        process.exit(0);
      }

      stats.total = eventsInstallationImportée.length + eventsCandidatureImportée.length;

      await executeQuery(
        `DROP RULE IF EXISTS prevent_update_on_event_stream on event_store.event_stream;`,
      );

      let count = 0;

      for (const { streamId, type, version } of [
        ...eventsInstallationImportée,
        ...eventsCandidatureImportée,
      ]) {
        count++;
        process.stdout.write(`\r⏳ [${count}/${stats.total}]`);

        try {
          await executeQuery(
            `
            UPDATE event_store.event_stream es
            SET payload = jsonb_set(
              es.payload,
              '{typologieInstallation}',
              (
                select jsonb_agg(
                  case when e->>'typologie' = 'sol'
                    then jsonb_set(e, '{typologie}', '"sol.non-précisé"')
                    else e end
                  order by i
                )
                from jsonb_array_elements(es.payload->'typologieInstallation') with ordinality as t(e, i)
              )
            )
            where
              es.stream_id = $1 and
              es.type = $2 and
              es.version = $3 and
              es.payload->'typologieInstallation' @> '[{"typologie": "sol"}]';
          `,
            streamId,
            type,
            version,
          );

          stats.sucess.push({ streamId, event: type });
        } catch (error) {
          stats.errors.push({ streamId, event: type, message: error as string });
        }
      }

      await executeQuery(
        `
        CREATE OR REPLACE RULE prevent_update_on_event_stream as on update to event_store.event_stream do instead
        select event_store.throw_when_trying_to_update_event();
      `,
      );

      console.info(`\n📊 Résultat :`);
      console.info(`  ✅ ${stats.sucess.length} projets migrés`);
      console.info(`  ❌ ${stats.errors.length} projets en erreur`);

      if (stats.errors.length) {
        await writeFile(
          './migrer-sol-en-sol-non-precise-errors.csv',
          await ExportCSV.toCSV({
            data: stats.errors,
            fields: [
              { label: 'Stream', value: 'streamId' },
              {
                label: 'Message',
                value: 'message',
              },
            ],
          }),
          'utf-8',
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
}
