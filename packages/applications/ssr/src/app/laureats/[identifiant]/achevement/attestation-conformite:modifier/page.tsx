import { Metadata } from 'next';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Achèvement } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import {
  ModifierAttestationConformitéPage,
  ModifierAttestationConformitéPageProps,
} from '@/components/pages/attestation-conformité/modifier/modifierAttestationConformité.page';
import { vérifierQueLeProjetEstClassé } from '@/app/_helpers';

export const metadata: Metadata = {
  title: `Modifier l'attestation de conformité - Potentiel`,
  description: `Formulaire de modification de l'attestation de conformité du projet et de la preuve de sa transmission au co-contractant`,
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    await vérifierQueLeProjetEstClassé({
      identifiantProjet,
      message:
        'Vous ne pouvez pas modifier une attestation de conformité pour un projet éliminé ou abandonné',
    });

    const attestationConformitéActuelle =
      await mediator.send<Achèvement.ConsulterAttestationConformitéQuery>({
        type: 'Lauréat.Achèvement.AttestationConformité.Query.ConsulterAttestationConformité',
        data: { identifiantProjetValue: identifiantProjet },
      });

    if (Option.isNone(attestationConformitéActuelle)) {
      return notFound();
    }

    return (
      <ModifierAttestationConformitéPage
        identifiantProjet={identifiantProjet}
        attestationConformitéActuelle={mapToProps(attestationConformitéActuelle)}
      />
    );
  });
}

type MapToProps = (
  attestationConformitéActuelle: Achèvement.ConsulterAttestationConformitéReadModel,
) => ModifierAttestationConformitéPageProps['attestationConformitéActuelle'];
const mapToProps: MapToProps = (attestationConformitéActuelle) => ({
  attestation: attestationConformitéActuelle.attestation.formatter(),
  preuveTransmissionAuCocontractant:
    attestationConformitéActuelle.preuveTransmissionAuCocontractant.formatter(),
  dateTransmissionAuCocontractant:
    attestationConformitéActuelle.dateTransmissionAuCocontractant.formatter(),
});
