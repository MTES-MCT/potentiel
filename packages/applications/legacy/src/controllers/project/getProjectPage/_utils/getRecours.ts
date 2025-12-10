import { mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Éliminé } from '@potentiel-domain/projet';

import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

export const getRecours = async (
  identifiantProjet: IdentifiantProjet.ValueType,
): Promise<Éliminé.Recours.ConsulterRecoursReadModel | undefined> => {
  try {
    const recours = await mediator.send<Éliminé.Recours.ConsulterRecoursQuery>({
      type: 'Éliminé.Recours.Query.ConsulterDemandeRecours',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

    if (Option.isNone(recours)) {
      return undefined;
    }

    return recours;
  } catch (error) {
    getLogger('Legacy|getProjectPage|getRecours').error(`Impossible de consulter le recours`, {
      identifiantProjet: identifiantProjet.formatter(),
    });
    return undefined;
  }
};
