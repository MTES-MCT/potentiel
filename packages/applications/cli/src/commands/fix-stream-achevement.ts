import { Command } from '@oclif/core';

import { Lauréat } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { executeQuery, executeSelect } from '@potentiel-libraries/pg-helpers';

export class FixStreamAchevementCommand extends Command {
  async run() {
    const streamsToFix = await executeSelect<{ stream_id: string; dateNotification: string }>(`
      SELECT 
        calc.stream_id, 
        min(notif.payload->>'notifiéLe') as "dateNotification" 
      FROM event_store.event_stream  calc
      INNER JOIN event_store.event_stream notif 
        ON notif.stream_id=replace(calc.stream_id, 'achevement|', 'lauréat|') AND notif.type LIKE 'LauréatNotifié-V%'
      WHERE 
        calc.stream_id LIKE 'achevement|%' 
        AND calc.version=1 
        AND calc.type<>'DateAchèvementPrévisionnelCalculée-V1'
      GROUP BY 1;
`);

    console.log(`Found ${streamsToFix.length} streams to fix.`);

    for (const { stream_id, dateNotification } of streamsToFix) {
      const events = await executeSelect<Lauréat.Achèvement.AchèvementEvent & Event>(
        `
        select * from event_store.event_stream 
        where stream_id=$1 
        order by version asc`,
        stream_id,
      );

      const createdAtBase = new Date(dateNotification);

      const newEvents = events
        .map((event, i) => {
          if (
            event.type === 'DateAchèvementPrévisionnelCalculée-V1' &&
            event.created_at.startsWith('2025-07-31')
          ) {
            return {
              ...event,
              // on prend la date de notification comme base pour l'event,
              // et on ajoute 1 ms par event afin d'assurer l'ordre et éviter les doublons
              created_at: new Date(createdAtBase.setMilliseconds(i)).toISOString(),
              previous_version: event.version,
              previous_created_at: event.created_at,
            };
          }
          return {
            ...event,
            previous_version: event.version,
            previous_created_at: event.created_at,
          };
        })
        .sort((a, b) => a.created_at.localeCompare(b.created_at))
        .map((event, i) => ({
          ...event,
          version: i + 1,
        }));

      for (const newEvent of newEvents) {
        const { rowCount } = await executeQuery(
          `
          update event_store.event_stream
          set version=$2, created_at=$3
          where stream_id=$1 and version=$4 and created_at=$5
          `,
          stream_id,
          newEvent.version,
          newEvent.created_at,
          newEvent.previous_version,
          newEvent.previous_created_at,
        );

        if (rowCount === 0) {
          console.log('No rows updated for event:', newEvent);
          return;
        }
      }
    }
  }
}
