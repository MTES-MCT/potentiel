import { mediator } from 'mediateur';

import { LoadAggregate } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { AnnulerTâchePlanifiéeCommand } from '@potentiel-domain/tache-planifiee';
import { SupprimerDocumentProjetSensibleCommand } from '@potentiel-domain/document';

import { AbandonAccordéEvent } from '../../abandon';
import { SupprimerChangementReprésentantLégalCommand } from '../changement/supprimer/supprimerChangementReprésentantLégal.command';
import { loadReprésentantLégalFactory, TypeTâchePlanifiéeChangementReprésentantLégal } from '..';

export const buildAbandonAccordéSaga = (loadAggregate: LoadAggregate) => {
  const load = loadReprésentantLégalFactory(loadAggregate);

  const handler = async ({ payload: { identifiantProjet } }: AbandonAccordéEvent) => {
    const représentantLégal = await load(IdentifiantProjet.convertirEnValueType(identifiantProjet));

    if (représentantLégal.demande) {
      await mediator.send<SupprimerChangementReprésentantLégalCommand>({
        type: 'Lauréat.ReprésentantLégal.Command.SupprimerChangementReprésentantLégal',
        data: {
          identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
          identifiantUtilisateur: Email.system(),
          dateSuppression: DateTime.now(),
        },
      });

      await mediator.send<SupprimerDocumentProjetSensibleCommand>({
        type: 'Document.Command.SupprimerDocumentProjetSensible',
        data: {
          documentProjet: représentantLégal.demande.pièceJustificative,
          raison: 'Pièce justificative supprimée automatiquement après annulation',
        },
      });
    }

    await mediator.send<AnnulerTâchePlanifiéeCommand>({
      type: 'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
        typeTâchePlanifiée:
          TypeTâchePlanifiéeChangementReprésentantLégal.gestionAutomatiqueDemandeChangement.type,
      },
    });

    await mediator.send<AnnulerTâchePlanifiéeCommand>({
      type: 'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
        typeTâchePlanifiée:
          TypeTâchePlanifiéeChangementReprésentantLégal.rappelInstructionÀDeuxMois.type,
      },
    });
  };

  return handler;
};
