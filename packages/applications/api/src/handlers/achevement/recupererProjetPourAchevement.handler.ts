import { mediator } from 'mediateur';

import type { AchevementV2 } from '@potentiel-applications/api-documentation';
import type { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { NotFoundError } from '../../errors.js';
import { mapToDonneesProjetPourAchevement } from './mapToDonneesProjetPourAchevement.js';

export const recupererProjetPourAchevementHandler: AchevementV2['recupererProjet'] = async (
  _,
  identifiantProjet,
) => {
  const projet = await mediator.send<Lauréat.Achèvement.ConsulterDonnéesProjetPourAchèvementQuery>({
    type: 'Lauréat.Achèvement.Query.ConsulterDonnéesProjetPourAchèvement',
    data: {
      identifiantProjetValue: decodeURIComponent(identifiantProjet),
    },
  });

  if (Option.isNone(projet)) {
    throw new NotFoundError('Projet non trouvé');
  }

  return mapToDonneesProjetPourAchevement(projet);
};
