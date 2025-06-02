import { mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

export const récupérerLauréat = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
    type: 'Lauréat.Query.ConsulterLauréat',
    data: {
      identifiantProjet,
    },
  });
  if (Option.isNone(lauréat)) {
    throw new Error("Le projet lauréat n'existe pas");
  }
  return {
    nom: lauréat.nomProjet,
    département: lauréat.localité.département,
    région: lauréat.localité.région,
  };
};
