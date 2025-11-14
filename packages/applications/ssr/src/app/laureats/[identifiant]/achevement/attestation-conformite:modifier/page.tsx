import { Metadata } from 'next';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { récupérerLauréatNonAbandonné } from '@/app/_helpers';

import {
  ModifierAttestationConformitéPage,
  ModifierAttestationConformitéPageProps,
} from './modifierAttestationConformité.page';

export const metadata: Metadata = {
  title: `Modifier l'attestation de conformité - Potentiel`,
  description: `Formulaire de modification de l'attestation de conformité du projet et de la preuve de sa transmission au co-contractant`,
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const projet = await récupérerLauréatNonAbandonné(identifiantProjet);

    const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
      type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
      data: { identifiantProjetValue: identifiantProjet },
    });

    if (Option.isNone(achèvement) || !achèvement.estAchevé) {
      return notFound();
    }

    const props = mapToProps(projet.identifiantProjet, achèvement);
    return (
      <ModifierAttestationConformitéPage
        identifiantProjet={props.identifiantProjet}
        attestationConformité={props.attestationConformité}
        dateTransmissionAuCocontractant={props.dateTransmissionAuCocontractant}
        preuveTransmissionAuCocontractant={props.preuveTransmissionAuCocontractant}
      />
    );
  });
}

type MapToProps = (
  identifiantProjet: IdentifiantProjet.ValueType,
  achèvement: Lauréat.Achèvement.ConsulterAchèvementAchevéReadModel,
) => ModifierAttestationConformitéPageProps;
const mapToProps: MapToProps = (
  identifiantProjet,
  { attestation, preuveTransmissionAuCocontractant, dateAchèvementRéel },
) => ({
  identifiantProjet: identifiantProjet.formatter(),
  dateTransmissionAuCocontractant: dateAchèvementRéel.formatter(),
  attestationConformité: attestation.formatter(),
  preuveTransmissionAuCocontractant: Option.isSome(preuveTransmissionAuCocontractant)
    ? preuveTransmissionAuCocontractant.formatter()
    : undefined,
});
