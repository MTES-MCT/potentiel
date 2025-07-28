import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';

import { TypeTâchePlanifiéeChangementReprésentantLégal } from '..';
import { Lauréat } from '../../..';
import { SupprimerDocumentProjetSensibleCommand } from '../changement/supprimerDocumentSensible/supprimerDocumentProjetSensible.command';

export const tâchePlanifiéeSuppressionDocumentExecutéeSaga = async ({
  payload: { identifiantProjet, typeTâchePlanifiée },
}: Lauréat.TâchePlanifiée.TâchePlanifiéeExecutéeEvent) => {
  if (
    typeTâchePlanifiée !==
    TypeTâchePlanifiéeChangementReprésentantLégal.gestionAutomatiqueDemandeChangement.type
  ) {
    return;
  }

  const cahierDesCharges = await mediator.send<Lauréat.ConsulterCahierDesChargesQuery>({
    type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesCharges',
    data: {
      identifiantProjetValue: identifiantProjet,
    },
  });

  if (Option.isNone(cahierDesCharges)) {
    throw new TâchePlanifiéeGestionAutomatiqueDemandeChangementError(
      `Projet non trouvé`,
      identifiantProjet,
    );
  }

  const règlesChangement = cahierDesCharges.getRèglesChangements('représentantLégal');

  if (!règlesChangement.instructionAutomatique) {
    return;
  }

  await mediator.send<SupprimerDocumentProjetSensibleCommand>({
    type: 'Lauréat.ReprésentantLégal.Command.SupprimerDocumentProjetSensible',
    data: {
      identifiantProjet,
      raison: 'Pièce justificative supprimée automatiquement après annulation',
    },
  });
};

class TâchePlanifiéeGestionAutomatiqueDemandeChangementError extends Error {
  constructor(
    public cause: string,
    public identifiantProjet: string,
  ) {
    super(
      `Impossible de traiter automatiquement la tâche planifiée pour le changement de représentant légal`,
    );
  }
}
