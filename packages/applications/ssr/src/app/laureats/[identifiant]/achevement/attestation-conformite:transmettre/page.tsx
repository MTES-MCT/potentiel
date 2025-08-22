import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import type { GarantiesFinancières } from '@potentiel-domain/laureat';
import type { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { récupérerLauréatNonAbandonné } from '@/app/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import {
  TransmettreAttestationConformitéPage,
  type TransmettreAttestationConformitéPageProps,
} from './transmettreAttestationConformité.page';

export const metadata: Metadata = {
  title: `Transmettre l'attestation de conformité - Potentiel`,
  description: `Formulaire de transmission de l'attestation de conformité du projet et de la preuve de sa transmission au co-contractant`,
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const projet = await récupérerLauréatNonAbandonné(identifiantProjet);

    const garantiesFinancières =
      await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        data: {
          identifiantProjetValue: identifiantProjet,
        },
      });

    const props = mapToProps({
      identifiantProjet: projet.identifiantProjet,
      garantiesFinancières,
    });

    return (
      <TransmettreAttestationConformitéPage
        identifiantProjet={props.identifiantProjet}
        peutDemanderMainlevée={props.peutDemanderMainlevée}
        peutVoirMainlevée={props.peutVoirMainlevée}
      />
    );
  });
}

type MapToProps = (params: {
  identifiantProjet: IdentifiantProjet.ValueType;
  garantiesFinancières: Option.Type<GarantiesFinancières.ConsulterGarantiesFinancièresReadModel>;
}) => TransmettreAttestationConformitéPageProps;

const mapToProps: MapToProps = ({ identifiantProjet, garantiesFinancières }) => {
  const peutVoirMainlevée = Option.isSome(garantiesFinancières);
  const peutDemanderMainlevée =
    peutVoirMainlevée && garantiesFinancières.garantiesFinancières.attestation !== undefined;

  return {
    identifiantProjet: identifiantProjet.formatter(),
    peutDemanderMainlevée,
    peutVoirMainlevée,
  };
};
