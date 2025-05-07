import { Command, Flags } from '@oclif/core';

import { Candidature, Lauréat } from '@potentiel-domain/projet';
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
      "select count(*) as count from event_store.subscriber where stream_category='producteur'",
    );

    if (subscriberCount[0].count > 0 && !flags.dryRun) {
      console.warn("Il existe des subscribers pour 'producteur'");
      process.exit(1);
    }

    console.log(`${candidatures.length} candidatures à importer`);
    console.log(`${lauréats.length} lauréats à importer`);

    const eventsPerProjet: Record<string, Lauréat.Producteur.ProducteurEvent[]> = {};

    for (const lauréat of lauréats) {
      const candidature = candidatures.find(
        (candidature) => candidature.identifiantProjet === lauréat.identifiantProjet,
      );
      if (!candidature) {
        console.warn('candidature non trouvée', lauréat.identifiantProjet);
        continue;
      }
      // const producteurImporté: Lauréat.Producteur.ProducteurImportéEvent = {
      //   type: 'ProducteurImporté-V1',
      //   payload: {
      //     producteur: candidature.nomCandidat,
      //     identifiantProjet: candidature.identifiantProjet,
      //     importéLe: candidature.notification!.notifiéeLe,
      //   },
      // };
      // eventsPerProjet[candidature.identifiantProjet] = [producteurImporté];
    }

    const eventsStats: Record<string, number> = {};

    for (const [identifiantProjet, events] of Object.entries(eventsPerProjet)) {
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
