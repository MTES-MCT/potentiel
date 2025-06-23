import { mediator } from 'mediateur';

import { AnnulerTâchePlanifiéeCommand } from '@potentiel-domain/tache-planifiee';

import { TypeTâchePlanifiéeChangementReprésentantLégal } from '..';
import { SupprimerDocumentProjetSensibleCommand } from '../changement/supprimerDocumentSensible/supprimerDocumentProjetSensible.command';
import { Abandon } from '../..';
import { IdentifiantProjet } from '../../..';

export const abandonAccordéSaga = async ({ payload }: Abandon.AbandonAccordéEvent) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

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
