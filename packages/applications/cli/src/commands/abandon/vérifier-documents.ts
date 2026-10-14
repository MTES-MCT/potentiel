import { Command } from '@oclif/core';
import { mediator } from 'mediateur';
import { match, P } from 'ts-pattern';
import z from 'zod';

import type { DateTime } from '@potentiel-domain/common';
import { Document, type IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DocumentAdapter } from '@potentiel-infrastructure/domain-adapters';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { dbSchema, s3Schema } from '#helpers';

const envSchema = z.object({ ...dbSchema.shape, ...s3Schema.shape });

const query = `SELECT identifiantProjet, type, date, document
FROM (
  SELECT
    payload->>'identifiantProjet' AS identifiantProjet,
    type,
    CASE type
      WHEN 'AbandonDemandé-V1'             THEN payload->>'pièceJustificative'
      WHEN 'AbandonDemandé-V2'             THEN payload->>'pièceJustificative'
      WHEN 'AbandonAccordé-V1'             THEN payload->>'réponseSignée'
      WHEN 'AbandonRejeté-V1'              THEN payload->>'réponseSignée'
      WHEN 'ConfirmationAbandonDemandée-V1' THEN payload->>'réponseSignée'
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
)
WHERE document IS NOT NULL`;

export class VérifierDocumentsAbandonCommand extends Command {
  static description = 'Vérifier les documents abandon';

  async init() {
    envSchema.parse(process.env);

    Document.registerDocumentProjetCommand({
      enregistrerDocumentProjet: DocumentAdapter.téléverserDocumentProjet,
      déplacerDossierProjet: DocumentAdapter.déplacerDossierProjet,
      archiverDocumentProjet: DocumentAdapter.archiverDocumentProjet,
      enregistrerDocumentSubstitut: DocumentAdapter.enregistrerDocumentSubstitutAdapter,
    });
  }

  async run(): Promise<void> {
    const events = await executeSelect<{
      identifiantProjet: IdentifiantProjet.RawType;
      type: Lauréat.Abandon.AbandonEvent;
      date: DateTime.RawType;
      document: { format: string };
    }>(query);

    for (const event of events) {
      try {
        const documentKey = match(event.type)
          .returnType<string>()
          .with({ type: P.union('AbandonDemandé-V1', 'AbandonDemandé-V2') }, () =>
            Lauréat.Abandon.DocumentAbandon.pièceJustificative({
              identifiantProjet: event.identifiantProjet,
              demandéLe: event.date,
              pièceJustificative: event.document,
            }).formatter(),
          )
          .with({ type: 'ConfirmationAbandonDemandée-V1' }, () =>
            Lauréat.Abandon.DocumentAbandon.abandonAConfirmer({
              identifiantProjet: event.identifiantProjet,
              confirmationDemandéeLe: event.date,
              réponseSignée: event.document,
            }).formatter(),
          )
          .with({ type: 'AbandonAccordé-V1' }, () =>
            Lauréat.Abandon.DocumentAbandon.abandonAccordé({
              identifiantProjet: event.identifiantProjet,
              accordéLe: event.date,
              réponseSignée: event.document,
            }).formatter(),
          )
          .with({ type: 'AbandonRejeté-V1' }, () =>
            Lauréat.Abandon.DocumentAbandon.abandonRejeté({
              identifiantProjet: event.identifiantProjet,
              rejetéLe: event.date,
              réponseSignée: event.document,
            }).formatter(),
          )
          .otherwise(() => {
            throw new Error(`Type de document non supporté: ${String(event.type)}`);
          });

        await mediator.send<Document.ConsulterDocumentProjetQuery>({
          type: 'Document.Query.ConsulterDocumentProjet',
          data: {
            documentKey,
          },
        });

        console.log(`✅ Document existant`);
      } catch (e) {
        console.error(
          `❌ Erreur pour le projet ${event.identifiantProjet} type ${event.type} : ${e}`,
        );
      }
    }
  }
}
