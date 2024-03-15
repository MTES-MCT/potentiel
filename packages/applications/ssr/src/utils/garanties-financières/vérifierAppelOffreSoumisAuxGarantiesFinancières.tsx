import { mediator } from 'mediateur';

import { ConsulterAppelOffreQuery } from '@potentiel-domain/appel-offre';

export const vérifierAppelOffreSoumisAuxGarantiesFinancières = async (appelOffreId: string) => {
  const appelOffre = await mediator.send<ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: { identifiantAppelOffre: appelOffreId },
  });

  return (
    appelOffre.soumisAuxGarantiesFinancieres === 'à la candidature' ||
    appelOffre.soumisAuxGarantiesFinancieres === 'après candidature'
  );
};
