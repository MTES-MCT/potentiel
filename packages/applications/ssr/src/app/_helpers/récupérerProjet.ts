import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Candidature } from '@potentiel-domain/candidature';
import { Option } from '@potentiel-libraries/monads';

export const récupérerProjet = async (identifiantProjet: string) => {
  const projet = await mediator.send<Candidature.ConsulterProjetQuery>({
    type: 'Candidature.Query.ConsulterProjet',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(projet)) {
    return notFound();
  }

  return projet;
};
