import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Éliminé } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl } from './getBaseUrl.js';
import { ProjetNonTrouvéError } from './getLauréat.js';

export const getÉliminé = async (identifiantProjet: string) => {
  const éliminé = await mediator.send<Éliminé.ConsulterÉliminéQuery>({
    type: 'Éliminé.Query.ConsulterÉliminé',
    data: {
      identifiantProjet,
    },
  });
  if (Option.isNone(éliminé)) {
    throw new ProjetNonTrouvéError();
  }
  return {
    identifiantProjet: éliminé.identifiantProjet,
    nom: éliminé.nomProjet,
    région: éliminé.localité.région,
    département: éliminé.localité.département,
    url: getBaseUrl() + Routes.Projet.details(identifiantProjet),
  };
};
