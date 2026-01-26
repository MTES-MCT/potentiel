import { Command } from '@oclif/core';
import { mediator } from 'mediateur';

import { executeQuery, executeSelect } from '@potentiel-libraries/pg-helpers';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';

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

        await mediator.send<Lauréat.ModifierStatutLauréatUseCase>({
          type: 'Lauréat.UseCase.ModifierStatut',
          data: {
            identifiantProjetValue: projet.id,
            modifiéLeValue: projet.date,
            modifiéParValue: Email.système.formatter(),
            statutValue: Lauréat.StatutLauréat.abandonné.statut,
          },
        });
      } catch (e) {
        console.error('Erreur lors du traitement des projets abandonnés : ', e);
      }
    }

    const indexAchevé = 0;
    const totalAchevé = projetAchevé.length;
    for (const projet of projetAchevé) {
      try {
        console.log(
          `Traitement du projet achevé ${indexAchevé + 1} sur ${totalAchevé} : ${projet.id}`,
        );
        for (const projet of projetAchevé) {
          await mediator.send<Lauréat.ModifierStatutLauréatUseCase>({
            type: 'Lauréat.UseCase.ModifierStatut',
            data: {
              identifiantProjetValue: projet.id,
              modifiéLeValue: projet.date,
              modifiéParValue: Email.système.formatter(),
              statutValue: Lauréat.StatutLauréat.achevé.statut,
            },
          });
        }
      } catch (e) {
        console.error(`Erreur on ${projet.id}  : ${e}`);
      }
    }

    console.log('Rebuild des projections lauréat...');

    await executeQuery(`call event_store.rebuild('lauréat')`);
  }
}
