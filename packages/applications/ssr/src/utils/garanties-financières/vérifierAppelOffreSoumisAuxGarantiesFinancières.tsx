import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { ConsulterAppelOffreQuery } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';

export const projetSoumisAuxGarantiesFinancières = async ({
  appelOffre,
  periode,
  famille,
}: {
  appelOffre: string;
  periode: string;
  famille?: string;
}) => {
  const détailsAppelOffre = await mediator.send<ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: { identifiantAppelOffre: appelOffre },
  });

  if (Option.isNone(détailsAppelOffre)) {
    return notFound();
  }

  const familleDétails = détailsAppelOffre.periodes
    .find((p) => p.id === periode)
    ?.familles.find((f) => f.id === famille);

  return famille
    ? familleDétails?.soumisAuxGarantiesFinancieres !== 'non soumis'
    : détailsAppelOffre.soumisAuxGarantiesFinancieres !== 'non soumis';
};
