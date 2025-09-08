import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { récupérerLauréatNonAbandonné } from '@/app/_helpers';

import {
  TransmettreAttestationConformitéPage,
  TransmettreAttestationConformitéPageProps,
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
      await mediator.send<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
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
  garantiesFinancières: Option.Type<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel>;
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
