import fs from 'node:fs';
import path from 'node:path';

import { Command } from '@oclif/core';
import { mediator } from 'mediateur';
import { match, P } from 'ts-pattern';
import z from 'zod';

import type { DateTime } from '@potentiel-domain/common';
import { Document, type IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DocumentAdapter } from '@potentiel-infrastructure/domain-adapters';
import { Option } from '@potentiel-libraries/monads';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { dbSchema, s3Schema } from '#helpers';

const envSchema = z.object({ ...dbSchema.shape, ...s3Schema.shape });

const query = `SELECT identifiant, type, date, document
FROM (
  SELECT
    payload->>'identifiantProjet' AS identifiant,
    type,
    CASE type
      WHEN 'AbandonDemandé-V1'             THEN payload->'pièceJustificative'->>'format'
      WHEN 'AbandonDemandé-V2'             THEN payload->'pièceJustificative'->>'format'
      WHEN 'AbandonAccordé-V1'             THEN payload->'réponseSignée'->>'format'
      WHEN 'AbandonRejeté-V1'              THEN payload->'réponseSignée'->>'format'
      WHEN 'ConfirmationAbandonDemandée-V1' THEN payload->'réponseSignée'->>'format'
    END AS document,
    CASE type
      WHEN 'AbandonDemandé-V1'             THEN payload->>'demandéLe'
      WHEN 'AbandonDemandé-V2'             THEN payload->>'demandéLe'
      WHEN 'AbandonAccordé-V1'             THEN payload->>'accordéLe'
      WHEN 'AbandonRejeté-V1'              THEN payload->>'rejetéLe'
      WHEN 'ConfirmationAbandonDemandée-V1' THEN payload->>'confirmationDemandéeLe'
    END AS date
  FROM event_store.event_stream
  WHERE stream_id LIKE 'abandon%'
    AND type IN (
      'AbandonDemandé-V1',
      'AbandonDemandé-V2',
      'AbandonAccordé-V1',
      'AbandonRejeté-V1',
      'ConfirmationAbandonDemandée-V1'
    )
) t
WHERE document IS NOT NULL;`;

export class VérifierDocumentsAbandonCommand extends Command {
  static description = 'Vérifier les documents abandon';

  async init() {
    envSchema.parse(process.env);

    Document.registerDocumentProjetQueries({
      récupérerDocumentProjet: DocumentAdapter.téléchargerDocumentProjet,
    });
  }

  async run(): Promise<void> {
    type Event = {
      identifiant: IdentifiantProjet.RawType;
      type: string;
      date: DateTime.RawType;
      document: string;
    };

    const events = await executeSelect<Event>(query);

    const stats = {
      total: events.length,
      existant: 0,
      absent: 0,
      absentDétails: [] as Array<Event>,
      erreur: 0,
    };

    for (const event of events) {
      try {
        const documentKey = match(event.type)
          .returnType<string>()
          .with(P.union('AbandonDemandé-V1', 'AbandonDemandé-V2'), () =>
            Lauréat.Abandon.DocumentAbandon.pièceJustificative({
              identifiantProjet: event.identifiant,
              demandéLe: event.date,
              pièceJustificative: { format: event.document },
            }).formatter(),
          )
          .with('ConfirmationAbandonDemandée-V1', () =>
            Lauréat.Abandon.DocumentAbandon.abandonAConfirmer({
              identifiantProjet: event.identifiant,
              confirmationDemandéeLe: event.date,
              réponseSignée: { format: event.document },
            }).formatter(),
          )
          .with('AbandonAccordé-V1', () =>
            Lauréat.Abandon.DocumentAbandon.abandonAccordé({
              identifiantProjet: event.identifiant,
              accordéLe: event.date,
              réponseSignée: { format: event.document },
            }).formatter(),
          )
          .with('AbandonRejeté-V1', () =>
            Lauréat.Abandon.DocumentAbandon.abandonRejeté({
              identifiantProjet: event.identifiant,
              rejetéLe: event.date,
              réponseSignée: { format: event.document },
            }).formatter(),
          )
          .otherwise(() => {
            throw new Error(`Type de document non supporté: ${String(event.type)}`);
          });

        const doc = await mediator.send<Document.ConsulterDocumentProjetQuery>({
          type: 'Document.Query.ConsulterDocumentProjet',
          data: {
            documentKey,
          },
        });

        if (Option.isSome(doc)) {
          console.log(`✅ Document existant`);
          stats.existant++;
        } else {
          console.log(
            `❌ Document manquant pour le projet ${event.identifiant} type ${event.type}`,
          );
          stats.absent++;
          stats.absentDétails.push(event);
        }
      } catch (e) {
        console.error(`❌ Erreur pour le projet ${event.identifiant} type ${event.type} : ${e}`);
        stats.erreur++;
      }
    }

    const outputPath = path.join(process.cwd(), 'erreurs_migration.json');
    fs.writeFileSync(outputPath, JSON.stringify(stats.absentDétails, null, 2), 'utf-8');

    console.log(
      `\r⏳ ${stats.total} TOTAL / ${stats.erreur} documents non existants / ${stats.existant} docs ok`,
    );
    console.log(`⚠️ Fichier des erreurs généré : ${outputPath}`);
  }
}
