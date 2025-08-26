import { mediator } from 'mediateur';
import { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { Option } from '@potentiel-libraries/monads';

export const getAutorisationDUrbanisme = async (identifiantProjet: IdentifiantProjet.ValueType) => {
  const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
    type: 'Candidature.Query.ConsulterCandidature',
    data: {
      identifiantProjet: identifiantProjet.formatter(),
    },
  });

  return Option.isSome(candidature) ? candidature.dépôt.autorisationDUrbanisme : undefined;
};
