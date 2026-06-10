import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import type { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { getLauréat } from './getLauréat';

export const récupérerLauréat = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const lauréat = await getLauréat(identifiantProjet);

  if (!lauréat) {
    return notFound();
  }

  return lauréat;
};

export const récupérerLauréatNonAbandonné = async (
  identifiantProjet: IdentifiantProjet.RawType,
) => {
  const projet = await récupérerLauréat(identifiantProjet);

  if (projet.statut.estAbandonné()) {
    return notFound();
  }

  return projet;
};

export const récupérerLauréatSansAbandon = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const projet = await récupérerLauréat(identifiantProjet);

  const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
    type: 'Lauréat.Abandon.Query.ConsulterAbandon',
    data: {
      identifiantProjetValue: identifiantProjet,
    },
  });

  if (Option.isSome(abandon) && (abandon.estAbandonné || abandon.demandeEnCours)) {
    return notFound();
  }

  return projet;
};
