import { mediator } from 'mediateur';

import { ConsulterAppelOffreQuery } from '@potentiel-domain/appel-offre';

export const projetSoumisAuxGarantiesFinancières = async ({
  appelOffre,
  famille,
}: {
  appelOffre: string;
  famille?: string;
}) => {
  const détailAppelOffre = await mediator.send<ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: { identifiantAppelOffre: appelOffre },
  });
  return famille
    ? détailAppelOffre.familles.find((f) => f.id === famille)?.soumisAuxGarantiesFinancieres !==
        'non soumis'
    : détailAppelOffre.soumisAuxGarantiesFinancieres !== 'non soumis';
};
