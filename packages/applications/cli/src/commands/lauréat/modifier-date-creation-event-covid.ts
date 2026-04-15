import { Command } from '@oclif/core';
import z from 'zod';

import { executeQuery, executeSelect } from '@potentiel-libraries/pg-helpers';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { dbSchema } from '#helpers';

const envSchema = z.object({
  ...dbSchema.shape,
});

export class ModifierDateCreationEventCovidCommand extends Command {
  static override description = `Modification de la date de création de l'évènement d'attribution d'un délai covid pour qu'il arrive juste après la notification du lauréat.`;
  async run() {
    envSchema.parse(process.env);

    const projetAvecUnEvenementCovid = `
      with covidEvents as (
        select
        es.payload->>'identifiantProjet' as identifiant_projet,
        es.version as event_covid_version,
        es.created_at::date as event_covid_created_date
        from event_store.event_stream es
        where es.type = 'DateAchèvementPrévisionnelCalculée-V1'
        and es.payload->>'raison' = 'covid'
      ),
      notificationEvents as (
        select
        es.payload->>'identifiantProjet' as identifiant_projet,
        (es.payload->>'notifiéLe')::timestamp::date as notification_date,
        es.payload->>'notifiéLe' as notifie_le
        from event_store.event_stream es
        where es.type in ('LauréatNotifié-V1', 'LauréatNotifié-V2')
      )
      select
        c.identifiant_projet,
        c.event_covid_version,
        n.notifie_le
      from covidEvents c
      join notificationEvents n
      on 
        n.identifiant_projet = c.identifiant_projet
      where 
        c.event_covid_created_date IS DISTINCT FROM n.notification_date
    `;

    const stats = {
      total: 0,
      succès: 0,
      erreurs: 0,
    };

    try {
      const events = await executeSelect<{
        identifiant_projet: IdentifiantProjet.RawType;
        event_covid_version: number;
        notifie_le: DateTime.RawType;
      }>(projetAvecUnEvenementCovid);

      if (!events.length) {
        console.info(
          'Aucun projet trouvé avec un événement covid, aucune modification à effectuer',
        );
        return;
      }

      await executeSelect(
        `DROP RULE IF EXISTS prevent_update_on_event_stream on event_store.event_stream;`,
      );

      stats.total = events.length;

      for (const { identifiant_projet, notifie_le } of events) {
        await executeQuery(
          `
            update event_store.event_stream
            set 
              created_at = $1
            where 
              stream_id = $2 
              and type = 'DateAchèvementPrévisionnelCalculée-V1' 
              and payload->>'raison' = 'covid'
          `,
          DateTime.convertirEnValueType(notifie_le).ajouterNombreDeMillisecondes(500).formatter(),
          `achevement|${identifiant_projet}`,
        );

        stats.succès += 1;
      }

      await executeQuery(`call event_store.rebuild('achevement');`);

      await executeSelect(`
        CREATE OR REPLACE RULE prevent_update_on_event_stream as on update to event_store.event_stream do instead
        select event_store.throw_when_trying_to_update_event();
      `);
    } catch (error) {
      console.error(
        "Erreur lors de la modification de la date de création de l'événement covid :",
        error,
      );
      stats.erreurs += 1;
    } finally {
      console.info('Statistiques :');
      console.table(stats);
    }
  }
}
