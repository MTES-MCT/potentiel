import { Command } from '@oclif/core';

import { executeQuery, executeSelect } from '@potentiel-libraries/pg-helpers';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';

type Projet = {
  id: IdentifiantProjet.RawType;
  date: DateTime.RawType;
};

const queryAbandon = `
SELECT "payload"->>'identifiantProjet' as id, payload->>'accordéLe' as date from event_store.event_stream
WHERE type = 'AbandonAccordé-V1';
`;

// pas besoin d'inclure les event date d'achèvement, aucun événement en DB de prod
const queryAchèvement = `
SELECT "payload"->>'identifiantProjet' as id, payload->>'date' as date from event_store.event_stream
WHERE type = 'AttestationConformitéTransmise-V1';
`;

export class EmettreModifierStatutLauréatEvent extends Command {
  async run() {
    const projetAbandonné = await executeSelect<Projet>(queryAbandon);
    const projetAchevé = await executeSelect<Projet>(queryAchèvement);

    const indexAbandonné = 0;
    const totalAbandonné = projetAbandonné.length;
    for (const projet of projetAbandonné) {
      try {
        console.log(
          `Traitement du projet abandonné ${indexAbandonné + 1} sur ${totalAbandonné} : ${projet.id}`,
        );

        const event: Lauréat.StatutLauréatModifiéEvent = {
          type: 'StatutLauréatModifié-V1',
          payload: {
            identifiantProjet: projet.id,
            modifiéLe: projet.date,
            modifiéPar: Email.système.formatter(),
            statut: Lauréat.StatutLauréat.abandonné.formatter(),
          },
        };

        await publish(`lauréat|${projet.id}`, event);
      } catch (e) {
        console.error(`Erreur pour le projet abandonné ${projet.id}  : ${e}`);
      }
    }

    const indexAchevé = 0;
    const totalAchevé = projetAchevé.length;
    for (const projet of projetAchevé) {
      try {
        console.log(
          `Traitement du projet achevé ${indexAchevé + 1} sur ${totalAchevé} : ${projet.id}`,
        );
        const event: Lauréat.StatutLauréatModifiéEvent = {
          type: 'StatutLauréatModifié-V1',
          payload: {
            identifiantProjet: projet.id,
            modifiéLe: projet.date,
            modifiéPar: Email.système.formatter(),
            statut: Lauréat.StatutLauréat.achevé.formatter(),
          },
        };
        await publish(`lauréat|${projet.id}`, event);
      } catch (e) {
        console.error(`Erreur pour le projet achevé ${projet.id}  : ${e}`);
      }
    }

    console.log('Rebuild des projections lauréat...');

    await executeQuery(`call event_store.rebuild('lauréat')`);
  }
}
