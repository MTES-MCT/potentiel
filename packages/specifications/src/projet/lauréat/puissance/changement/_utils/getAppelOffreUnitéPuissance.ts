import { mediator } from 'mediateur';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';

export const getApelOffreUnitéPuissance = async (appelOffreId: string) => {
  const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: {
      identifiantAppelOffre: appelOffreId,
    },
  });

  if (Option.isNone(appelOffre)) {
    throw new Error("Appel d'offre introuvable");
  }

  return appelOffre.unitePuissance;
};
