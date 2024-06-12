import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { InvalidOperationError } from '@potentiel-domain/core';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { showMainLevéeGarantiesFinancières } from '@potentiel-applications/feature-flags';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import {
  TransmettreAttestationConformitéPage,
  TransmettreAttestationConformitéPageProps,
} from '@/components/pages/attestation-conformité/transmettre/transmettreAttestationConformité.page';

export const metadata: Metadata = {
  title: `Transmettre l'attestation de conformité - Potentiel`,
  description: `Formulaire de transmission de l'attestation de conformité du projet et de la preuve de sa transmission au co-contractant`,
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const candidature = await mediator.send<ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: { identifiantProjet },
    });

    if (candidature.statut !== 'classé') {
      throw new InvalidOperationError(
        `Vous ne pouvez pas transmettre une attestation de conformité pour un projet éliminé ou abandonné`,
      );
    }

    const garantiesFinancières =
      await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        data: {
          identifiantProjetValue: identifiantProjet,
        },
      });

    const showDemanderMainLevée =
      Option.isSome(garantiesFinancières) &&
      Option.isSome(garantiesFinancières.garantiesFinancières.attestation) &&
      Option.isSome(garantiesFinancières.garantiesFinancières.validéLe) &&
      showMainLevéeGarantiesFinancières;

    const projet = { ...candidature, identifiantProjet };

    const props: TransmettreAttestationConformitéPageProps = {
      projet,
      showDemanderMainLevée,
    };

    return <TransmettreAttestationConformitéPage {...props} />;
  });
}
