import { mediator } from 'mediateur';

import { LoadAggregate } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { AnnulerTâchePlanifiéeCommand } from '@potentiel-domain/tache-planifiee';

import { AbandonAccordéEvent } from '../../abandon';
import { SupprimerChangementReprésentantLégalCommand } from '../changement/supprimer/supprimerChangementReprésentantLégal.command';
import { loadReprésentantLégalFactory, TypeTâchePlanifiéeChangementReprésentantLégal } from '..';
import { SupprimerDocumentProjetSensibleCommand } from '../changement/supprimerDocumentSensible/supprimerDocumentProjetSensible.command';

export const buildAbandonAccordéSaga = (loadAggregate: LoadAggregate) => {
  const load = loadReprésentantLégalFactory(loadAggregate);

  const handler = async ({ payload }: AbandonAccordéEvent) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);
    const représentantLégal = await load(identifiantProjet);

    if (représentantLégal.demande) {
      await mediator.send<SupprimerChangementReprésentantLégalCommand>({
        type: 'Lauréat.ReprésentantLégal.Command.SupprimerChangementReprésentantLégal',
        data: {
          identifiantProjet,
          identifiantUtilisateur: Email.system(),
          dateSuppression: DateTime.now(),
        },
      });

      await mediator.send<SupprimerDocumentProjetSensibleCommand>({
        type: 'Lauréat.ReprésentantLégal.Command.SupprimerDocumentProjetSensible',
        data: {
          identifiantProjet,
          raison: 'Pièce justificative supprimée automatiquement après annulation',
        },
      });
    }

    await mediator.send<AnnulerTâchePlanifiéeCommand>({
      type: 'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
      data: {
        identifiantProjet,
        typeTâchePlanifiée:
          TypeTâchePlanifiéeChangementReprésentantLégal.gestionAutomatiqueDemandeChangement.type,
      },
    });

    await mediator.send<AnnulerTâchePlanifiéeCommand>({
      type: 'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
      data: {
        identifiantProjet,
        typeTâchePlanifiée:
          TypeTâchePlanifiéeChangementReprésentantLégal.rappelInstructionÀDeuxMois.type,
      },
    });
  };

  return handler;
};
