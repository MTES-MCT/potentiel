import { Command, Flags } from '@oclif/core';
import { match } from 'ts-pattern';

import { Accès } from '@potentiel-domain/projet';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  AccèsProjetRetiréEvent,
  PorteurInvitéEvent,
  ProjetRéclaméEvent,
} from '@potentiel-domain/utilisateur';

export class Migrer extends Command {
  static flags = {
    dryRun: Flags.boolean(),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Migrer);

    const subscriberCount = await executeSelect<{ count: number }>(
      "select count(*) as count from event_store.subscriber where stream_category='accès'",
    );

    if (subscriberCount[0].count > 0 && !flags.dryRun) {
      console.warn("Il existe des subscribers pour 'accès'");
      process.exit(1);
    }

    const eventsStats: Record<string, number> = {};

    const eventsQuery = `
      select * 
      from event_store.event_stream es 
      where es.type in ('PorteurInvité-V1', 'AccèsProjetRetiré-V1', 'ProjetRéclamé-V1')
      order by es.created_at asc
    `;

    const legacyEvents = await executeSelect<
      PorteurInvitéEvent | AccèsProjetRetiréEvent | ProjetRéclaméEvent
    >(eventsQuery);

    const newEvents: Array<Accès.AccèsProjetAutoriséEvent | Accès.AccèsProjetRetiréEvent> = [];

    for (const event of legacyEvents) {
      match(event)
        .with(
          { type: 'PorteurInvité-V1' },
          ({ payload: { identifiantUtilisateur, identifiantsProjet, invitéLe, invitéPar } }) => {
            for (const identifiantProjet of identifiantsProjet) {
              const event: Accès.AccèsProjetAutoriséEvent = {
                type: 'AccèsProjetAutorisé-V1',
                payload: {
                  identifiantProjet,
                  identifiantUtilisateur,
                  autoriséLe: invitéLe,
                  autoriséPar: invitéPar,
                  raison: 'invitation',
                },
              };

              newEvents.push(event);
            }
          },
        )
        .with(
          { type: 'AccèsProjetRetiré-V1' },
          ({
            payload: { identifiantProjet, identifiantUtilisateur, retiréLe, retiréPar, cause },
          }) => {
            const event: Accès.AccèsProjetRetiréEvent = {
              type: 'AccèsProjetRetiré-V1',
              payload: {
                identifiantProjet,
                identifiantsUtilisateur: [identifiantUtilisateur],
                retiréLe,
                retiréPar,
                cause,
              },
            };

            newEvents.push(event);
          },
        )
        .with(
          { type: 'ProjetRéclamé-V1' },
          ({ payload: { identifiantProjet, identifiantUtilisateur, réclaméLe } }) => {
            const event: Accès.AccèsProjetAutoriséEvent = {
              type: 'AccèsProjetAutorisé-V1',
              payload: {
                identifiantProjet,
                identifiantUtilisateur,
                autoriséLe: réclaméLe,
                autoriséPar: identifiantUtilisateur,
                raison: 'réclamation',
              },
            };

            newEvents.push(event);
          },
        )
        .exhaustive();
    }

    for (const newEvent of newEvents) {
      if (!flags.dryRun) {
        await publish(`accès|${newEvent.payload.identifiantProjet}`, newEvent);
      }

      eventsStats[newEvent.type] ??= 0;
      eventsStats[newEvent.type]++;
    }

    console.log(eventsStats);
    console.log('All events published.');
  }
}
