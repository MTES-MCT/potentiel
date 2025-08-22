import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

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
    nom: lauréat.nomProjet,
    région: lauréat.localité.région,
    département: lauréat.localité.département,
    url: getBaseUrl() + Routes.Projet.details(identifiantProjet),
  };
};
