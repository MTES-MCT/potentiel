import { Command, Flags } from '@oclif/core';

import { Puissance, Lauréat } from '@potentiel-domain/laureat';
import { Candidature } from '@potentiel-domain/projet';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';

export class Migrer extends Command {
  static flags = {
    dryRun: Flags.boolean(),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Migrer);
    const { items: lauréats } = await listProjection<Lauréat.LauréatEntity>('lauréat');
    const { items: candidatures } =
      await listProjection<Candidature.CandidatureEntity>('candidature');

    const subscriberCount = await executeSelect<{ count: number }>(
      "select count(*) as count from event_store.subscriber where stream_category='puissance'",
    );

    if (subscriberCount[0].count > 0 && !flags.dryRun) {
      console.warn("Il existe des subscribers pour 'puissance'");
      process.exit(1);
    }

    console.log(`${candidatures.length} candidatures à importer`);
    console.log(`${lauréats.length} lauréats à importer`);

    const eventsPerProjet: Record<string, Puissance.PuissanceEvent[]> = {};

    for (const lauréat of lauréats) {
      const candidature = candidatures.find(
        (candidature) => candidature.identifiantProjet === lauréat.identifiantProjet,
      );
      if (!candidature) {
        console.warn('candidature non trouvée', lauréat.identifiantProjet);
        continue;
      }
      const puissanceImportée: Puissance.PuissanceImportéeEvent = {
        type: 'PuissanceImportée-V1',
        payload: {
          puissance: candidature.puissanceProductionAnnuelle,
          identifiantProjet: candidature.identifiantProjet,
          importéeLe: candidature.notification!.notifiéeLe,
        },
      };
      eventsPerProjet[candidature.identifiantProjet] = [puissanceImportée];
    }

    const eventsStats: Record<string, number> = {};

    for (const [identifiantProjet, events] of Object.entries(eventsPerProjet)) {
      for (const event of events) {
        if (!flags.dryRun) {
          await publish(`puissance|${identifiantProjet}`, event);
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
