import { Metadata } from 'next';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import {
  EnregistrerAttestationGarantiesFinancièresPage,
  EnregistrerAttestationGarantiesFinancièresProps,
} from '@/components/pages/garanties-financières/actuelles/enregistrerAttestation/EnregistrerAttestationGarantiesFinancières.page';

export const metadata: Metadata = {
  title: `Enregistrer l'attestation de constitution des garanties financières actuelles - Potentiel`,
  description: `Formulaire pour Enregistrer l'attestation de constitution des garanties financières actuelles`,
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  if (!process.env.FEATURE_FLAG_GARANTIES_FINANCIERES) {
    return notFound();
  }

  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const candidature = await mediator.send<ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: { identifiantProjet },
    });

    const props: EnregistrerAttestationGarantiesFinancièresProps = {
      projet: {
        ...candidature,
        identifiantProjet,
      },
    };

    return <EnregistrerAttestationGarantiesFinancièresPage {...props} />;
  });
}
