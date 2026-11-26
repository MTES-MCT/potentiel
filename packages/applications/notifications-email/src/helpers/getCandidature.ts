import { mediator } from 'mediateur';

import type { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
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
    identifiantProjet: candidature.identifiantProjet.formatter(),
    nom: candidature.dépôt.nomProjet,
    appelOffre: candidature.identifiantProjet.appelOffre,
    période: candidature.identifiantProjet.période,
    département: candidature.dépôt.localité.département,
    région: candidature.dépôt.localité.région,
  };
};
