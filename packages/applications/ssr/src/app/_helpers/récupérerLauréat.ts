import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import type { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

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
  const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
    type: 'Lauréat.Abandon.Query.ConsulterAbandon',
    data: {
      identifiantProjetValue: identifiantProjet,
    },
  });

  if (Option.isSome(abandon) && abandon.statut.estAccordé()) {
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

  if (Option.isSome(abandon) && (abandon.statut.estEnCours() || abandon.statut.estAccordé())) {
    return notFound();
  }

  return projet;
};
