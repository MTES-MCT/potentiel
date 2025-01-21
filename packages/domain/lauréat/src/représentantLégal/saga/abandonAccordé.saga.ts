import { mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { AnnulerTâchePlanifiéeCommand } from '@potentiel-domain/tache-planifiee';

import { AbandonAccordéEvent } from '../../abandon';
import { SupprimerChangementReprésentantLégalCommand } from '../changement/supprimer/supprimerChangementReprésentantLégal.command';
import { TypeTâchePlanifiéeChangementReprésentantLégal } from '..';
import { SupprimerDocumentProjetSensibleCommand } from '../changement/supprimerDocumentSensible/supprimerDocumentProjetSensible.command';

export const abandonAccordéSaga = async ({ payload }: AbandonAccordéEvent) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

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
