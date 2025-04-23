import { mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/projet';

export const récupérerNomProjet = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
    type: 'Lauréat.Query.ConsulterLauréat',
    data: {
      identifiantProjet,
    },
  });
  if (Option.isSome(lauréat)) {
    return lauréat.nomProjet;
  }
  const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
    type: 'Candidature.Query.ConsulterCandidature',
    data: {
      identifiantProjet,
    },
  });
  if (Option.isSome(candidature)) {
    return candidature.nomProjet;
  }

  return '';
};
