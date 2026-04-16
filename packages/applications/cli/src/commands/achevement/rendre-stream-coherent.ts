import { Command } from '@oclif/core';
import z from 'zod';

import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';
import { ProjetAdapter } from '@potentiel-infrastructure/domain-adapters';

import { dbSchema } from '#helpers';

const envSchema = z.object({
  ...dbSchema.shape,
});

export class RendreStreamCoherentCommand extends Command {
  static override description = `Rend les streams raccordement cohérents et recalcul au besoin les dates d'achèvement prévisionnelles`;
  async run() {
    envSchema.parse(process.env);

    const stats = {
      eventNotification: {
        dateDifférentes: 0,
        dateÉgales: 0,
      },
    };

    try {
      const lauréats = await executeSelect<{
        identifiantProjet: IdentifiantProjet.RawType;
        dateNotification: DateTime.RawType;
      }>(
        `
          select 
            distinct payload->>'identifiantProjet' as "identifiantProjet", 
            payload->>'notifiéLe' as "dateNotification"
          from event_store.event_stream 
          where 
            type like 'LauréatNotifié-V%';`,
      );

      if (!lauréats.length) {
        console.info('Aucun projet trouvé avec un événement de notification de lauréat');
        return;
      }

      // await executeSelect(
      //   `DROP RULE IF EXISTS prevent_update_on_event_stream on event_store.event_stream;`,
      // );

      for (const { identifiantProjet, dateNotification } of lauréats.slice(0, 2)) {
        const identifiantProjetValueType =
          IdentifiantProjet.convertirEnValueType(identifiantProjet);

        const projetAggregateRoot = await ProjetAdapter.getProjetAggregateRootAdapter(
          identifiantProjetValueType,
        );

        const streamAchèvementPrévisionnel = await executeSelect<{
          version: number;
          payload: Lauréat.Achèvement.DateAchèvementPrévisionnelCalculéeEvent['payload'];
        }>(
          `
          select 
            stream_id as "streamId",
            created_at as "createdAt",
            version as "version", 
            payload as "payload"
          from event_store.event_stream 
          where 
            stream_id = $1 
            and type = 'DateAchèvementPrévisionnelCalculée-V1' 
          order by version`,
          `achevement|${identifiantProjet}`,
        );

        if (!streamAchèvementPrévisionnel.length) {
          console.info(
            `Aucun événement de calcul de date d'achèvement prévisionnelle trouvé pour le projet ${identifiantProjet}, le projet ne sera pas traité`,
          );
          continue;
        }

        console.log(
          `Projet a un stream de ${streamAchèvementPrévisionnel.length} événements de calcul de date d'achèvement prévisionnelle`,
        );

        for (const { version, payload } of streamAchèvementPrévisionnel) {
          if (version === 1) {
            const { date: dateActuelle } = payload;

            const dateCalculéeManuellement =
              await projetAggregateRoot.lauréat.achèvement.getDateAchèvementPrévisionnelCalculée({
                type: 'notification',
              });

            const dateÉgales = DateTime.convertirEnValueType(dateActuelle).estÉgaleÀ(
              DateTime.convertirEnValueType(dateCalculéeManuellement),
            );

            if (dateÉgales) {
              stats.eventNotification.dateÉgales += 1;
              continue;
            }

            if (!dateÉgales) {
              stats.eventNotification.dateDifférentes += 1;
              console.log(`❌ ${dateActuelle} => ${dateCalculéeManuellement}`);
            }
          }
        }
      }

      // await executeSelect(
      //   `DROP RULE IF EXISTS prevent_update_on_event_stream on event_store.event_stream;`,
      // );

      // stats.total = events.length;

      // for (const { streamId, identifiantProjet } of events) {
      //   const eventNotificationLauréat = await executeSelect<{
      //     dateNotification: DateTime.RawType;
      //   }>(
      //     `
      //     select payload->>'notifiéLe' as "dateNotification"
      //     from event_store.event_stream
      //     where stream_id = $1 and type like 'LauréatNotifié-V%';
      //     `,
      //     `lauréat|${identifiantProjet}`,
      //   );

      //   if (!eventNotificationLauréat.length) {
      //     console.info(
      //       `Aucun événement de notification de lauréat trouvé pour le projet ${identifiantProjet}, le projet ne sera pas traité`,
      //     );
      //     continue;
      //   }

      //   const [{ dateNotification }] = eventNotificationLauréat;

      //   await executeQuery(
      //     `
      //       update event_store.event_stream
      //       set version = version + 1
      //       where stream_id = $1
      //     `,
      //     streamId,
      //   );

      //   const eventGFDemandée: Lauréat.GarantiesFinancières.GarantiesFinancièresDemandéesEvent = {
      //     type: 'GarantiesFinancièresDemandées-V1',
      //     payload: {
      //       identifiantProjet,
      //       motif: 'non-déposé',
      //       demandéLe: dateNotification,
      //       dateLimiteSoumission: DateTime.convertirEnValueType(dateNotification)
      //         .ajouterNombreDeMois(2)
      //         .formatter(),
      //     },
      //   };

      //   await publish(streamId, {
      //     ...eventGFDemandée,
      //     version: 1,
      //     created_at: dateNotification,
      //   });

      //   stats.succès += 1;
      // }

      // await executeSelect(`
      //   CREATE OR REPLACE RULE prevent_update_on_event_stream as on update to event_store.event_stream do instead
      //   select event_store.throw_when_trying_to_update_event();
      // `);
    } catch (error) {
      console.error(error);
    } finally {
      console.info('Statistiques :');
      console.table(stats);
    }
  }
}
