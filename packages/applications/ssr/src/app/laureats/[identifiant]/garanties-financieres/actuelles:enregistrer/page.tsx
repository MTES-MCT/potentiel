import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { projetSoumisAuxGarantiesFinancières } from '@/utils/garanties-financières/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { ProjetNonSoumisAuxGarantiesFinancièresPage } from '@/components/pages/garanties-financières/ProjetNonSoumisAuxGarantiesFinancières.page';
import {
  EnregistrerGarantiesFinancièresPage,
  EnregistrerGarantiesFinancièresProps,
} from '@/components/pages/garanties-financières/actuelles/enregistrer/enregistrerGarantiesFinancières.page';
import { typesGarantiesFinancièresSansInconnuPourFormulaire } from '@/utils/garanties-financières/typesGarantiesFinancièresPourFormulaire';
import { ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { displayDate } from '@/utils/displayDate';

export const metadata: Metadata = {
  title: `Enregistrer des garanties financières actuelles - Potentiel`,
  description: `Formulaire pour enregistrer des garanties financières actuelles`,
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const candidature = await mediator.send<ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: { identifiantProjet },
    });

    const projet: ProjetBannerProps = {
      ...candidature,
      dateDésignation: displayDate(candidature.dateDésignation),
      identifiantProjet,
    };

    const soumisAuxGarantiesFinancières = await projetSoumisAuxGarantiesFinancières({
      appelOffre: candidature.appelOffre,
      famille: candidature.famille,
    });

    if (!soumisAuxGarantiesFinancières) {
      return <ProjetNonSoumisAuxGarantiesFinancièresPage projet={projet} />;
    }

    const props: EnregistrerGarantiesFinancièresProps = {
      projet,
      typesGarantiesFinancières: typesGarantiesFinancièresSansInconnuPourFormulaire,
    };

    return <EnregistrerGarantiesFinancièresPage {...props} />;
  });
}
