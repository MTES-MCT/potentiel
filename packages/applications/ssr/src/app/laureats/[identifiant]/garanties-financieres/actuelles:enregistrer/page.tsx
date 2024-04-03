import { Metadata } from 'next';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { featureFlags } from '@potentiel-applications/feature-flags';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { projetSoumisAuxGarantiesFinancières } from '@/utils/garanties-financières/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { ProjetNonSoumisAuxGarantiesFinancièresPage } from '@/components/pages/garanties-financières/ProjetNonSoumisAuxGarantiesFinancières.page';
import {
  EnregistrerGarantiesFinancièresPage,
  EnregistrerGarantiesFinancièresProps,
} from '@/components/pages/garanties-financières/actuelles/enregistrer/enregistrerGarantiesFinancières.page';
import { getGarantiesFinancièresTypeLabel } from '@/components/pages/garanties-financières/getGarantiesFinancièresTypeLabel';

export const metadata: Metadata = {
  title: `Enregistrer des garanties financières actuelles - Potentiel`,
  description: `Formulaire pour enregistrer des garanties financières actuelles`,
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  if (!featureFlags.SHOW_GARANTIES_FINANCIERES) {
    return notFound();
  }

  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const candidature = await mediator.send<ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: { identifiantProjet },
    });

    const projet = { ...candidature, identifiantProjet };

    const soumisAuxGarantiesFinancières = await projetSoumisAuxGarantiesFinancières({
      appelOffre: candidature.appelOffre,
      famille: candidature.famille,
    });

    if (!soumisAuxGarantiesFinancières) {
      return <ProjetNonSoumisAuxGarantiesFinancièresPage projet={projet} />;
    }

    const props: EnregistrerGarantiesFinancièresProps = {
      projet,
      typesGarantiesFinancières: GarantiesFinancières.TypeGarantiesFinancières.types.map(
        (type) => ({
          label: getGarantiesFinancièresTypeLabel(type),
          value: type,
        }),
      ),
    };

    return <EnregistrerGarantiesFinancièresPage {...props} />;
  });
}
