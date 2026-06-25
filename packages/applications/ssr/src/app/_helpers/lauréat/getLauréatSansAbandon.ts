import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import type { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { getLauréatInfos } from './getLauréatInfos';

export const getLauréatSansAbandon = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const projet = await getLauréatInfos(identifiantProjet);

  const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
    type: 'Lauréat.Abandon.Query.ConsulterAbandon',
    data: {
      identifiantProjetValue: identifiantProjet,
    },
  });

  if (Option.isSome(abandon) && (abandon.statut.estAccordé() || abandon.statut.estEnCours())) {
    return notFound();
  }

  return projet;
};
