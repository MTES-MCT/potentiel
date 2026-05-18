import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { buildUrl } from './buildUrl.js';

export class ProjetNonTrouvéError extends Error {
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
    url: buildUrl(Routes.Lauréat.détails.tableauDeBord(identifiantProjet)),
  };
};
