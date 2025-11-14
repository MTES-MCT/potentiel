import { mediator } from 'mediateur';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';

export const getAppelOffre = async (identifiantAppelOffre: string) => {
  const ao = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: { identifiantAppelOffre },
  });

  if (Option.isNone(ao)) {
    throw new Error(`L'appel d'offre est introuvable`);
  }

  return ao;
};
