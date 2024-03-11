import { mediator } from 'mediateur';

import { ConsulterAppelOffreQuery } from '@potentiel-domain/appel-offre';

import { ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { ProjetNonSoumisAuxGarantiesFinancièresPage } from '@/components/pages/garanties-financières/ProjetNonSoumisAuxGarantiesFinancières.page';

type VérifierProjetSoumisAuxGarantiesFinancièresProps = {
  projet: ProjetBannerProps;
  callback: () => Promise<JSX.Element>;
};

export const vérifierProjetSoumisAuxGarantiesFinancières = async ({
  projet,
  callback,
}: VérifierProjetSoumisAuxGarantiesFinancièresProps) => {
  const appelOffre = await mediator.send<ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: { identifiantAppelOffre: projet.appelOffre },
  });

  if (
    appelOffre.soumisAuxGarantiesFinancieres === 'à la candidature' ||
    appelOffre.soumisAuxGarantiesFinancieres === 'après candidature'
  ) {
    return await callback();
  }

  return <ProjetNonSoumisAuxGarantiesFinancièresPage projet={projet} />;
};
