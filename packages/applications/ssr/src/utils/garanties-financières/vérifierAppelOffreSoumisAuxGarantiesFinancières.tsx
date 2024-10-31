import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';

export const projetSoumisAuxGarantiesFinancières = async ({
  appelOffre,
  période,
  famille,
}: {
  appelOffre: string;
  période: string;
  famille?: string;
}) => {
  const détailsAppelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: { identifiantAppelOffre: appelOffre },
  });

  if (Option.isNone(détailsAppelOffre)) {
    return notFound();
  }

  const familleDétails = détailsAppelOffre.periodes
    .find((p) => p.id === période)
    ?.familles.find((f) => f.id === famille);

  return famille
    ? familleDétails?.soumisAuxGarantiesFinancieres !== 'non soumis'
    : détailsAppelOffre.soumisAuxGarantiesFinancieres !== 'non soumis';
};
