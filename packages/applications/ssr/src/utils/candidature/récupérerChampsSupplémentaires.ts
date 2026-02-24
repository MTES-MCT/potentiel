import { mediator } from 'mediateur';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';

export const récupérerChampsSupplémentaires = async ({
  appelOffreId,
  périodeId,
}: {
  appelOffreId: string | undefined;
  périodeId: string | undefined;
}) => {
  if (!appelOffreId || !périodeId) {
    return;
  }
  const détailAppelOffres = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: { identifiantAppelOffre: appelOffreId },
  });

  if (Option.isNone(détailAppelOffres)) {
    return;
  }

  const champsSupplémentairesAppelOffres = détailAppelOffres.champsSupplémentaires ?? {};
  const champsSupplémentairesPeriode =
    détailAppelOffres.periodes.find((p) => p.id === périodeId)?.champsSupplémentaires ?? {};

  return [
    ...new Set([
      ...Object.keys(champsSupplémentairesAppelOffres),
      ...Object.keys(champsSupplémentairesPeriode),
    ]),
  ] as AppelOffre.ChampCandidature[];
};
