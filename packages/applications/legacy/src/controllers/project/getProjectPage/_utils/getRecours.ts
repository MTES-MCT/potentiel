import { mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Recours } from '@potentiel-domain/elimine';

import { Option } from '@potentiel-libraries/monads';
import { ProjectDataForProjectPage } from '../../../../modules/project';

export const getRecours = async (
  identifiantProjet: IdentifiantProjet.ValueType,
): Promise<ProjectDataForProjectPage['demandeRecours']> => {
  const recours = await mediator.send<Recours.ConsulterRecoursQuery>({
    type: 'Éliminé.Recours.Query.ConsulterRecours',
    data: { identifiantProjetValue: identifiantProjet.formatter() },
  });

  return Option.isSome(recours) ? { statut: recours.statut.value } : undefined;
};
