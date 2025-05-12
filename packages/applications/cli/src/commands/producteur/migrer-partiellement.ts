import { Command, Flags } from '@oclif/core';

import { Lauréat } from '@potentiel-domain/projet';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';

export class Migrer extends Command {
  static flags = {
    dryRun: Flags.boolean(),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Migrer);

    const subscriberCount = await executeSelect<{ count: number }>(
      "select count(*) as count from event_store.subscriber where stream_category='producteur'",
    );

    if (subscriberCount[0].count > 0 && !flags.dryRun) {
      console.warn("Il existe des subscribers pour 'producteur'");
      process.exit(1);
    }

    const queryPayloads = `
      select concat(p."appelOffreId", '#', p."periodeId", '#', p."familleId", '#', p."numeroCRE") as "identifiantProjet",
             es.payload->>'producteur' as "producteur",
             (SELECT to_char (es."occurredAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) as "enregistréLe",
             u."email" as "enregistréPar",
             es.payload->>'justification' as "raison",
             json_build_object('format', 'pdf') as "pièceJustificative",
             es.payload->>'fileId' as "fileId"
      from "eventStores" es
      inner join projects p on es.payload->>'projectId' = p.id::text
      inner join users u on es.payload->>'requestedBy' = u.id::text
      where es.type like 'Modification%'
      and   payload->>'type' = 'producteur'
      order by es."occurredAt" asc
    `;
    const payloads =
      await executeSelect<Lauréat.Producteur.ChangementProducteurEnregistréEvent['payload']>(
        queryPayloads,
      );

    const eventsPerProjet: Map<string, Lauréat.Producteur.ChangementProducteurEnregistréEvent[]> =
      payloads.reduce((eventsPerProjet, payload) => {
        eventsPerProjet.set(payload.identifiantProjet, [
          ...(eventsPerProjet.get(payload.identifiantProjet) ?? []),
          {
            type: 'ChangementProducteurEnregistré-V1',
            payload,
          },
        ]);

        return eventsPerProjet;
      }, new Map());

    const eventsStats: Record<string, number> = {};

    for (const [identifiantProjet, events] of eventsPerProjet) {
      for (const event of events) {
        if (!flags.dryRun) {
          await publish(`producteur|${identifiantProjet}`, event);
        }
        eventsStats[event.type] ??= 0;
        eventsStats[event.type]++;
      }
    }
    console.log(eventsStats);

    console.log('All events published.');

    process.exit(0);
  }
}
