import { mediator } from 'mediateur';

import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

export const getCandidature = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
    type: 'Candidature.Query.ConsulterCandidature',
    data: {
      identifiantProjet,
    },
  });
  if (Option.isNone(candidature)) {
    throw new Error("La candidature n'existe pas");
  }
  return {
    nom: candidature.dépôt.nomProjet,
    département: candidature.dépôt.localité.département,
    région: candidature.dépôt.localité.région,
  };
};
