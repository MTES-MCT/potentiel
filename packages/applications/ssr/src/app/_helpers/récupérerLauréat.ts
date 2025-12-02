import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';

export const récupérerLauréat = async (identifiantProjet: string) => {
  const projet = await mediator.send<Lauréat.ConsulterLauréatQuery>({
    type: 'Lauréat.Query.ConsulterLauréat',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(projet)) {
    return notFound();
  }

  return projet;
};

export const récupérerLauréatNonAbandonné = async (identifiantProjet: string) => {
  const projet = await récupérerLauréat(identifiantProjet);
  if (projet.statut.estAbandonné()) {
    return notFound();
  }

  return projet;
};

export const récupérerLauréatSansAbandon = async (identifiantProjet: string) => {
  const projet = await récupérerLauréat(identifiantProjet);

  const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
    type: 'Lauréat.Abandon.Query.ConsulterAbandon',
    data: {
      identifiantProjetValue: identifiantProjet,
    },
  });

  if (Option.isSome(abandon)) {
    return notFound();
  }

  return projet;
};
