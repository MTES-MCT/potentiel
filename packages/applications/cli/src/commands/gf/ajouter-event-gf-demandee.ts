import { Command } from '@oclif/core';
import z from 'zod';

import { executeQuery, executeSelect } from '@potentiel-libraries/pg-helpers';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';

import { dbSchema } from '#helpers';

const envSchema = z.object({
  ...dbSchema.shape,
});

export class AjouterEventGfDemandee extends Command {
  static override description = `Ajout d'un événement GF demandée pour les projets pour les projets n'ent ayant pas et étant concernés, afin d'initier un stream gf`;
  async run() {
    envSchema.parse(process.env);

    const projetAvecUnDépôtSoumisEnPremierEvent = `
      select 
        stream_id as "streamId", 
        payload->>'identifiantProjet' as "identifiantProjet"
      from event_store.event_stream es 
      where 
        type = 'DépôtGarantiesFinancièresSoumis-V1' 
        and es."version" = 1 
      order by stream_id
    `;

    const stats = {
      total: 0,
      succès: 0,
      erreurs: 0,
    };

    try {
      const events = await executeSelect<{
        identifiantProjet: IdentifiantProjet.RawType;
        streamId: string;
      }>(projetAvecUnDépôtSoumisEnPremierEvent);

      if (!events.length) {
        console.info('Aucun projet trouvé avec un dépôt soumis en premier événement');
        return;
      }

      await executeSelect(
        `DROP RULE IF EXISTS prevent_update_on_event_stream on event_store.event_stream;`,
      );

      stats.total = events.length;

      for (const { streamId, identifiantProjet } of events) {
        const eventNotificationLauréat = await executeSelect<{
          dateNotification: DateTime.RawType;
        }>(
          `
          select payload->>'notifiéLe' as "dateNotification" 
          from event_store.event_stream 
          where stream_id = $1 and type like 'LauréatNotifié-V%';
          `,
          `lauréat|${identifiantProjet}`,
        );

        if (!eventNotificationLauréat.length) {
          console.info(
            `Aucun événement de notification de lauréat trouvé pour le projet ${identifiantProjet}, le projet ne sera pas traité`,
          );
          continue;
        }

        const [{ dateNotification }] = eventNotificationLauréat;

        await executeQuery(
          `
            update event_store.event_stream
            set version = version + 1
            where stream_id = $1
          `,
          streamId,
        );

        const eventGFDemandée: Lauréat.GarantiesFinancières.GarantiesFinancièresDemandéesEvent = {
          type: 'GarantiesFinancièresDemandées-V1',
          payload: {
            identifiantProjet,
            motif: 'non-déposé',
            demandéLe: dateNotification,
            dateLimiteSoumission: DateTime.convertirEnValueType(dateNotification)
              .ajouterNombreDeMois(2)
              .formatter(),
          },
        };

        await publish(streamId, {
          ...eventGFDemandée,
          version: 1,
          created_at: dateNotification,
        });

        stats.succès += 1;
      }

      await executeSelect(`
        CREATE OR REPLACE RULE prevent_update_on_event_stream as on update to event_store.event_stream do instead
        select event_store.throw_when_trying_to_update_event();
      `);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'événement GF demandée :", error);
      stats.erreurs += 1;
    } finally {
      console.info('Statistiques :');
      console.table(stats);
    }
  }
}
