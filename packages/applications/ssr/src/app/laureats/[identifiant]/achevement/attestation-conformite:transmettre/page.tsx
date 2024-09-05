import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import {
  TransmettreAttestationConformitéPage,
  TransmettreAttestationConformitéPageProps,
} from '@/components/pages/attestation-conformité/transmettre/transmettreAttestationConformité.page';
import { récupérerProjet, vérifierQueLeProjetEstClassé } from '@/app/_helpers';

export const metadata: Metadata = {
  title: `Transmettre l'attestation de conformité - Potentiel`,
  description: `Formulaire de transmission de l'attestation de conformité du projet et de la preuve de sa transmission au co-contractant`,
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const projet = await récupérerProjet(identifiantProjet);
    await vérifierQueLeProjetEstClassé({
      statut: projet.statut,
      message:
        'Vous ne pouvez pas transmettre une attestation de conformité pour un projet non classé',
    });

    const garantiesFinancières =
      await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        data: {
          identifiantProjetValue: identifiantProjet,
        },
      });

    const peutVoirMainlevée = Option.isSome(garantiesFinancières);

    const peutDemanderMainlevée =
      peutVoirMainlevée && garantiesFinancières.garantiesFinancières.attestation !== undefined;

    const props: TransmettreAttestationConformitéPageProps = {
      projet: {
        ...projet,
        identifiantProjet,
      },
      peutDemanderMainlevée,
      peutVoirMainlevée,
    };

    return <TransmettreAttestationConformitéPage {...props} />;
  });
}
