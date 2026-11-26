import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import type { Éliminé } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { buildUrl } from './buildUrl.js';
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
    url: buildUrl(Routes.Éliminé.détails.tableauDeBord(identifiantProjet)),
  };
};
