import { Metadata, ResolvingMetadata } from 'next';

import { Candidature } from '@potentiel-domain/candidature';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import {
  CorrigerCandidaturePage,
  CorrigerCandidaturePageProps,
} from '@/components/pages/candidature/corriger/CorrigerCandidature.page';

import { getCandidature } from '../../_helpers/getCandidature';

type PageProps = IdentifiantParameter;

export async function generateMetadata(
  { params }: IdentifiantParameter,
  _: ResolvingMetadata,
): Promise<Metadata> {
  const identifiantProjet = decodeParameter(params.identifiant);
  const candidature = await getCandidature(identifiantProjet);

  return {
    title: `Candidature ${candidature.nomProjet} - Potentiel`,
    description: 'Corriger la candidature',
  };
}

export default async function Page({ params }: PageProps) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(params.identifiant);

    const props = mapToProps(await getCandidature(identifiantProjet));

    return (
      <CorrigerCandidaturePage
        candidature={props.candidature}
        aUneAttestation={props.aUneAttestation}
        estNotifiée={props.estNotifiée}
      />
    );
  });
}
type MapToProps = (
  candidature: Candidature.ConsulterCandidatureReadModel,
) => CorrigerCandidaturePageProps;
const mapToProps: MapToProps = (candidature) => ({
  candidature: {
    identifiantProjet: candidature.identifiantProjet.formatter(),
    statut: candidature.statut.formatter(),
    nomProjet: candidature.nomProjet,
    nomCandidat: candidature.nomCandidat,
    nomRepresentantLegal: candidature.nomReprésentantLégal,
    emailContact: candidature.emailContact.formatter(),
    puissanceProductionAnnuelle: candidature.puissanceProductionAnnuelle,
    prixReference: candidature.prixReference,
    societeMere: candidature.sociétéMère,
    noteTotale: candidature.noteTotale,
    motifElimination: candidature.motifÉlimination,
    puissanceALaPointe: candidature.puissanceALaPointe,
    evaluationCarboneSimplifiee: candidature.evaluationCarboneSimplifiée,
    actionnariat: candidature.actionnariat?.formatter(),
    adresse1: candidature.localité.adresse1,
    adresse2: candidature.localité.adresse2,
    codePostal: candidature.localité.codePostal,
    commune: candidature.localité.commune,
    departement: candidature.localité.département,
    region: candidature.localité.région,
    technologie: candidature.technologie.formatter(),
    typeGarantiesFinancieres: candidature.typeGarantiesFinancières?.type,
    dateEcheanceGf: candidature.dateÉchéanceGf?.date,
  },
  estNotifiée: !!candidature.notification,
  aUneAttestation: !!candidature.notification?.attestation,
});
