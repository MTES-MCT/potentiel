import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/candidature';

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
        'Vous ne pouvez pas transmettre une attestation de conformité pour un projet éliminé ou abandonné',
    });

    const garantiesFinancières =
      await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        data: {
          identifiantProjetValue: identifiantProjet,
        },
      });

    const props = mapToProps({
      identifiantProjet,
      projet,
      garantiesFinancières,
    });

    return (
      <TransmettreAttestationConformitéPage
        projet={props.projet}
        peutDemanderMainlevée={props.peutDemanderMainlevée}
        peutVoirMainlevée={props.peutVoirMainlevée}
      />
    );
  });
}

type MapToProps = (params: {
  identifiantProjet: string;
  projet: Candidature.ConsulterProjetReadModel;
  garantiesFinancières: Option.Type<GarantiesFinancières.ConsulterGarantiesFinancièresReadModel>;
}) => TransmettreAttestationConformitéPageProps;

const mapToProps: MapToProps = ({ identifiantProjet, projet, garantiesFinancières }) => {
  const peutVoirMainlevée = Option.isSome(garantiesFinancières);
  const peutDemanderMainlevée =
    peutVoirMainlevée && garantiesFinancières.garantiesFinancières.attestation !== undefined;

  return {
    projet: {
      ...projet,
      identifiantProjet,
    },
    peutDemanderMainlevée,
    peutVoirMainlevée,
  };
};
