import { Metadata } from 'next';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { récupérerLauréatNonAbandonné } from '@/app/_helpers';

import { récuperérerGarantiesFinancièresActuelles } from '../../garanties-financieres/_helpers/récupérerGarantiesFinancièresActuelles';

import {
  TransmettreAttestationConformitéPage,
  TransmettreAttestationConformitéPageProps,
} from './transmettreAttestationConformité.page';

export const metadata: Metadata = {
  title: `Transmettre l'attestation de conformité - Potentiel`,
  description: `Formulaire de transmission de l'attestation de conformité du projet et de la preuve de sa transmission au co-contractant`,
};

/***
 * Ici on peut pas faire de vérification de permission car en fonction des données renseignées
 * on va appeler plusieurs usecases
 *
 * TODO : utilisateur.rôle.peutExécuterPlusieursMessages()
 */
export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const projet = await récupérerLauréatNonAbandonné(identifiantProjet);

    const garantiesFinancières = await récuperérerGarantiesFinancièresActuelles(
      projet.identifiantProjet.formatter(),
    );

    const props = mapToProps({
      identifiantProjet: projet.identifiantProjet,
      garantiesFinancières,
      notifiéLe: projet.notifiéLe,
    });

    return (
      <TransmettreAttestationConformitéPage
        identifiantProjet={props.identifiantProjet}
        demanderMainlevée={props.demanderMainlevée}
        lauréatNotifiéLe={props.lauréatNotifiéLe}
      />
    );
  });
}

type MapToProps = (params: {
  identifiantProjet: IdentifiantProjet.ValueType;
  garantiesFinancières: Option.Type<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel>;
  notifiéLe: DateTime.ValueType;
}) => TransmettreAttestationConformitéPageProps;

const mapToProps: MapToProps = ({ identifiantProjet, garantiesFinancières, notifiéLe }) => {
  const peutVoirMainlevée = Option.isSome(garantiesFinancières);
  const peutDemanderMainlevée =
    peutVoirMainlevée && garantiesFinancières.garantiesFinancières.estConstitué();

  return {
    identifiantProjet: identifiantProjet.formatter(),
    demanderMainlevée: {
      canBeDone: peutDemanderMainlevée,
      visible: peutVoirMainlevée,
    },
    lauréatNotifiéLe: notifiéLe.formatter(),
  };
};
