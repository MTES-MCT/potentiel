import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat, Éliminé } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl } from './getBaseUrl.js';
import { ProjetNonTrouvéError } from './getLauréat.js';

/***
 * Cette fonction permet de récupérer les informations d'un projet qu'il soit lauréat ou éliminé, en fonction de son identifiant.
 * À utiliser de préférence quand on ne connait pas le statut du projet au préalable.
 */
export const getProjet = async (identifiantProjet: string) => {
  const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
    type: 'Lauréat.Query.ConsulterLauréat',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isSome(lauréat)) {
    return {
      identifiantProjet: lauréat.identifiantProjet,
      nom: lauréat.nomProjet,
      région: lauréat.localité.région,
      département: lauréat.localité.département,
      url: `${getBaseUrl()}${Routes.Lauréat.détails.tableauDeBord(identifiantProjet)}`,
    };
  }

  const éliminé = await mediator.send<Éliminé.ConsulterÉliminéQuery>({
    type: 'Éliminé.Query.ConsulterÉliminé',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isSome(éliminé)) {
    return {
      identifiantProjet: éliminé.identifiantProjet,
      nom: éliminé.nomProjet,
      région: éliminé.localité.région,
      département: éliminé.localité.département,
      url: `${getBaseUrl()}${Routes.Éliminé.détails.tableauDeBord(identifiantProjet)}`,
    };
  }

  throw new ProjetNonTrouvéError();
};
