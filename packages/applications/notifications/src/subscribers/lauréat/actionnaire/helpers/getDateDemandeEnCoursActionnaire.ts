import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';

export class DemandeEnCoursNonTrouvéeError extends Error {
  constructor() {
    super('Demande en cours non trouvée');
  }
}

export const getDateDemandeEnCoursActionnaire = async (identifiantProjet: string) => {
  const actionnaire = await mediator.send<Lauréat.Actionnaire.ConsulterActionnaireQuery>({
    type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(actionnaire) || !actionnaire.dateDemandeEnCours) {
    throw new DemandeEnCoursNonTrouvéeError();
  }

  return actionnaire.dateDemandeEnCours.formatter();
};
