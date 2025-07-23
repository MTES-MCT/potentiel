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
      "select count(*) as count from event_store.subscriber where stream_category='délai'",
    );

    if (subscriberCount[0].count > 0 && !flags.dryRun) {
      console.warn("Il existe des subscribers pour 'délai'");
      process.exit(1);
    }

    const eventsStats: Record<string, number> = {};

    const demandesDélaiQuery = `
      select 
        p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE" as "identifiantProjet",
        mr."delayInMonths" as "nombreDeMois",
        mr."requestedOn" as "dateDemande",
        mr."userId" as "identifiantUtilisateur",
        mr."status" as "statut",
        mr."justification" as "raison",
        mr."fileId" as "identifiantPièceJustificative",
        mr."respondedBy" as "identifiantInstructeur",
        mr."respondedOn" as "dateInstruction",
        mr."responseFileId" as "identifiantRéponseSignée",
        mr."acceptanceParams" as "accord",
        mr."cancelledBy" as "identifiantAnnulateur",
        mr."cancelledOn" as "dateAnnulation"
      from "modificationRequests" mr 
      join "projects" p on p."id" = mr."projectId"
      where mr.type = 'delai'
      order by mr."createdAt";
    `;

    const demandes = await executeSelect<{}>(demandesDélaiQuery);

    const newEvents: Array<Lauréat.Délai.DélaiAccordéEvent> = [];

    for (const demande of demandes) {
    }

    for (const newEvent of newEvents) {
      if (!flags.dryRun) {
        await publish(`délai|${newEvent.payload.identifiantProjet}`, newEvent);
      }

      eventsStats[newEvent.type] ??= 0;
      eventsStats[newEvent.type]++;
    }

    console.log(eventsStats);
    console.log('All events published.');
    process.exit(0);
  }
}
