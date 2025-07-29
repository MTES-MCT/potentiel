import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';

import { TypeTâchePlanifiéeChangementReprésentantLégal } from '..';
import { Lauréat } from '../../..';
import { SupprimerDocumentProjetSensibleCommand } from '../changement/supprimerDocumentSensible/supprimerDocumentProjetSensible.command';

// comment savoir de quels documents il s'agit ?
export const tâchePlanifiéeSuppressionDocumentExecutéeSaga = async ({
  payload: { identifiantProjet, typeTâchePlanifiée, mis },
}: Lauréat.TâchePlanifiée.TâchePlanifiéeExecutéeEvent) => {
  if (
    typeTâchePlanifiée !==
    TypeTâchePlanifiéeChangementReprésentantLégal.suppressionDocumentÀTroisMois.type
  ) {
    return;
  }

  const tâchePlanifiée = await mediator.send<Lauréat.TâchePlanifiée.ListerTâchesPlanifiéesQuery>({
    type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
    data: {
      identifiantProjet,
      demandéLe: 
      
    }
  })

  const informationEnregistrée = await mediator.send<Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
    type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
    data: {
      identifiantProjet,
      demandéLe: 
      
    }
  })

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
