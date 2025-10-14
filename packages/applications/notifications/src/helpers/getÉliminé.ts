import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { Éliminé } from '@potentiel-domain/projet';

import { getBaseUrl } from './getBaseUrl';
import { ProjetNonTrouvéError } from './ProjetNonTrouvé.error';

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
    url: getBaseUrl() + Routes.Projet.détailsÉliminé(identifiantProjet),
  };
};
