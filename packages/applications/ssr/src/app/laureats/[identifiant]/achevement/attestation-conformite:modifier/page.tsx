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

    const attestationConformitéActuelle =
      await mediator.send<Lauréat.Achèvement.ConsulterAttestationConformitéQuery>({
        type: 'Lauréat.Achèvement.AttestationConformité.Query.ConsulterAttestationConformité',
        data: { identifiantProjetValue: identifiantProjet },
      });

    if (Option.isNone(attestationConformitéActuelle)) {
      return notFound();
    }

    const props = mapToProps(projet.identifiantProjet, attestationConformitéActuelle);

    return (
      <ModifierAttestationConformitéPage
        identifiantProjet={props.identifiantProjet}
        attestationConformitéActuelle={props.attestationConformitéActuelle}
      />
    );
  });
}

type MapToProps = (
  identifiantProjet: IdentifiantProjet.ValueType,
  attestationConformitéActuelle: Lauréat.Achèvement.ConsulterAttestationConformitéReadModel,
) => ModifierAttestationConformitéPageProps;
const mapToProps: MapToProps = (identifiantProjet, attestationConformitéActuelle) => ({
  identifiantProjet: identifiantProjet.formatter(),
  attestationConformitéActuelle: {
    attestation: attestationConformitéActuelle.attestation.formatter(),
    preuveTransmissionAuCocontractant:
      attestationConformitéActuelle.preuveTransmissionAuCocontractant.formatter(),
    dateTransmissionAuCocontractant:
      attestationConformitéActuelle.dateTransmissionAuCocontractant.formatter(),
  },
});
