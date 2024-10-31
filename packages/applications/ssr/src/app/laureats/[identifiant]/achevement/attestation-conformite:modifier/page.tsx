import { Metadata } from 'next';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Achèvement } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/candidature';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import {
  ModifierAttestationConformitéPage,
  ModifierAttestationConformitéPageProps,
} from '@/components/pages/attestation-conformité/modifier/modifierAttestationConformité.page';
import { récupérerProjet, vérifierQueLeProjetEstClassé } from '@/app/_helpers';

export const metadata: Metadata = {
  title: `Modifier l'attestation de conformité - Potentiel`,
  description: `Formulaire de modification de l'attestation de conformité du projet et de la preuve de sa transmission au co-contractant`,
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const projet = await récupérerProjet(identifiantProjet);
    await vérifierQueLeProjetEstClassé({
      statut: projet.statut,
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

    const props = mapToProps(identifiantProjet, projet, attestationConformitéActuelle);

    return (
      <ModifierAttestationConformitéPage
        projet={props.projet}
        attestationConformitéActuelle={props.attestationConformitéActuelle}
      />
    );
  });
}

type MapToProps = (
  identifiantProjet: string,
  projet: Candidature.ConsulterProjetReadModel,
  attestationConformitéActuelle: Achèvement.ConsulterAttestationConformitéReadModel,
) => ModifierAttestationConformitéPageProps;
const mapToProps: MapToProps = (identifiantProjet, projet, attestationConformitéActuelle) => ({
  projet: {
    ...projet,
    identifiantProjet,
  },
  attestationConformitéActuelle: {
    attestation: attestationConformitéActuelle.attestation.formatter(),
    preuveTransmissionAuCocontractant:
      attestationConformitéActuelle.preuveTransmissionAuCocontractant.formatter(),
    dateTransmissionAuCocontractant:
      attestationConformitéActuelle.dateTransmissionAuCocontractant.formatter(),
  },
});
