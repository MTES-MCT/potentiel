import { Command, Flags } from '@oclif/core';

import { Actionnaire, Lauréat } from '@potentiel-domain/laureat';
import { listProjection } from '@potentiel-infrastructure/pg-projections';
import { Candidature } from '@potentiel-domain/candidature';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';

type ModificationRequest = {
  identifiantProjet: string;
  status: 'en instruction' | 'annulée' | 'acceptée' | 'envoyée' | 'information validée';
  actionnaire: string;
  justification: string;
  requestedOn: number;
  email: string;
  cancelledOn: number;
  cancelledBy: string;
  respondedOn: number;
  respondedBy: string;
};

const queryModifications = `
  select format(
        '%s#%s#%s#%s',
        p."appelOffreId",
        p."periodeId",
        p."familleId",
        p."numeroCRE"
    ) as "identifiantProjet",
    mr.status,
    mr.actionnaire,
    mr.justification,
    mr."requestedOn",
    u.email,
    mr."cancelledOn",
    mr."respondedOn",
    u_cancel.email as "cancelledBy",
    u_respond.email as "respondedBy"
from "modificationRequests" mr
    inner join projects p on p.id = mr."projectId"
    left join users u on u.id = mr."userId"
    left join users u_cancel on u_cancel.id = mr."cancelledBy"
    left join users u_respond on u_respond.id = mr."respondedBy"
where mr.type = 'actionnaire' and mr.actionnaire is not null and mr.actionnaire<>'';
    `;

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
      "select count(*) as count from event_store.subscriber where stream_category='actionnaire'",
    );

    const stats: Record<string, string[]> = {};

    if (subscriberCount[0].count > 0 && !flags.dryRun) {
      console.warn("Il existe des subscribers pour 'actionnaire'");
      process.exit(1);
    }

    console.log(`${candidatures.length} candidatures à importer`);

    const eventsPerProjet: Record<string, Actionnaire.ActionnaireEvent[]> = {};

    // todo changer en lauréat
    for (const lauréat of lauréats) {
      const candidature = candidatures.find(
        (candidature) => candidature.identifiantProjet === lauréat.identifiantProjet,
      );
      if (!candidature) {
        stats['candidature non trouvée'] ??= [];
        stats['candidature non trouvée'].push(lauréat.identifiantProjet);
        continue;
      }
      const actionnaireImporté: Actionnaire.ActionnaireImportéEvent = {
        type: 'ActionnaireImporté-V1',
        payload: {
          actionnaire: candidature.sociétéMère,
          identifiantProjet: candidature.identifiantProjet,
          importéLe: candidature.notification!.notifiéeLe,
        },
      };
      eventsPerProjet[candidature.identifiantProjet] = [actionnaireImporté];
    }

    const modifications = await executeSelect<ModificationRequest>(queryModifications);
    console.log(`${modifications.length} modifications trouvées`);
    for (const modification of modifications) {
      if (!eventsPerProjet[modification.identifiantProjet]) {
        console.warn(`Pas d'import trouvé pour ${modification.identifiantProjet}`);
        continue;
      }

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        modification.identifiantProjet,
      ).formatter();

      const requestedOn = DateTime.convertirEnValueType(
        new Date(modification.requestedOn * 1000),
      ).formatter();
      const request: Actionnaire.ChangementActionnaireDemandéEvent = {
        type: 'ChangementActionnaireDemandé-V1',
        payload: {
          actionnaire: modification.actionnaire,
          demandéeLe: requestedOn,
          demandéePar: modification.email,
          identifiantProjet,
          raison: modification.justification,
          // TODO !!
          pièceJustificative: { format: 'application/pdf' },
        },
      };
      const modifié: Actionnaire.ActionnaireModifiéEvent = {
        type: 'ActionnaireModifié-V1',
        payload: {
          actionnaire: modification.actionnaire,
          identifiantProjet,
          modifiéLe: requestedOn,
          modifiéPar: modification.email,
        },
      };
      switch (modification.status) {
        case 'acceptée':
          const acceptation: Actionnaire.ActionnaireEvent = {
            type: 'DemandeChangementActionnaireAccordée-V1',
            payload: {
              identifiantProjet,
              accordéeLe: DateTime.convertirEnValueType(
                new Date(modification.respondedOn * 1000),
              ).formatter(),
              accordéePar: modification.respondedBy,
              nouvelActionnaire: modification.actionnaire,
              // TODO !!
              réponseSignée: { format: 'application/pdf' },
            },
          };
          // TODO est-ce qu'on doit publier modifié ou laisser la saga s'en charger ?
          eventsPerProjet[modification.identifiantProjet].push(request, acceptation, modifié);
          break;
        // TODO rejected ?
        case 'annulée':
          const annulation: Actionnaire.ActionnaireEvent = {
            type: 'DemandeChangementActionnaireAnnulée-V1',
            payload: {
              identifiantProjet,
              annuléeLe: DateTime.convertirEnValueType(
                new Date(modification.cancelledOn * 1000),
              ).formatter(),
              annuléePar: modification.cancelledBy,
            },
          };
          eventsPerProjet[modification.identifiantProjet].push(request, annulation);
          break;

        case 'envoyée':
        case 'en instruction':
          eventsPerProjet[modification.identifiantProjet].push(request);
          break;
        case 'information validée':
          eventsPerProjet[modification.identifiantProjet].push(modifié);
      }
    }

    for (const [identifiantProjet, events] of Object.entries(eventsPerProjet)) {
      console.log(identifiantProjet, events.map((ev) => ev.type).join(', '));
      if (!flags.dryRun) {
        for (const event of events) {
          await publish(`actionnaire|${identifiantProjet}`, event);
        }
      }
    }
    process.exit(0);
  }
}
