import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl } from './getBaseUrl';

class ProjetNonTrouvéError extends Error {
  constructor() {
    super('Projet non trouvé');
  }
}

export const getLauréat = async (identifiantProjet: string) => {
  const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
    type: 'Lauréat.Query.ConsulterLauréat',
    data: {
      identifiantProjet,
    },
  });
  if (Option.isNone(lauréat)) {
    throw new ProjetNonTrouvéError();
  }
  return {
    identifiantProjet: lauréat.identifiantProjet,
    nomProjet: lauréat.nomProjet,
    localité: lauréat.localité,
    url: getBaseUrl() + Routes.Projet.details(identifiantProjet),
  };
};
