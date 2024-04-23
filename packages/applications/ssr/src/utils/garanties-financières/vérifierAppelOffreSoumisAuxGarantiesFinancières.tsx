import { mediator } from 'mediateur';

import { ConsulterAppelOffreQuery } from '@potentiel-domain/appel-offre';

export const projetSoumisAuxGarantiesFinancières = async ({
  appelOffre,
  periode,
  famille,
}: {
  appelOffre: string;
  periode: string;
  famille?: string;
}) => {
  const détailAppelOffre = await mediator.send<ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: { identifiantAppelOffre: appelOffre },
  });
  const familleDétails = détailAppelOffre.periodes
    .find((p) => p.id === periode)
    ?.familles.find((f) => f.id === famille);

  return famille
    ? familleDétails?.soumisAuxGarantiesFinancieres !== 'non soumis'
    : détailAppelOffre.soumisAuxGarantiesFinancieres !== 'non soumis';
};
