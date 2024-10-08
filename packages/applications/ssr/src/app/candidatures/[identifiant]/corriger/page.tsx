import { Metadata, ResolvingMetadata } from 'next';
import { ComponentProps } from 'react';

import { Candidature } from '@potentiel-domain/candidature';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { CorrigerCandidaturePage } from '@/components/pages/candidature/corriger/CorrigerCandidature.page';

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
    description: 'Modifier la candidature',
  };
}

export default async function Page({ params }: PageProps) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(params.identifiant);
    const candidature = await getCandidature(identifiantProjet);
    return <CorrigerCandidaturePage {...mapToProps(candidature)} />;
  });
}

const mapToProps = (
  candidature: Candidature.ConsulterCandidatureReadModel,
): ComponentProps<typeof CorrigerCandidaturePage> => ({
  candidature: {
    identifiantProjet: candidature.identifiantProjet.formatter(),
    statut: candidature.statut.formatter(),
    nomProjet: candidature.nomProjet,
    typeGarantiesFinancières: candidature.typeGarantiesFinancières?.type,
    historiqueAbandon: candidature.historiqueAbandon.formatter(),
    nomCandidat: candidature.nomCandidat,
    nomReprésentantLégal: candidature.nomReprésentantLégal,
    emailContact: candidature.emailContact,
    puissanceProductionAnnuelle: candidature.puissanceProductionAnnuelle,
    prixRéference: candidature.prixReference,
    technologie: candidature.technologie.formatter(),
    sociétéMère: candidature.sociétéMère,
    noteTotale: candidature.noteTotale,
    motifÉlimination: candidature.motifÉlimination,
    puissanceÀLaPointe: candidature.puissanceALaPointe,
    evaluationCarboneSimplifiée: candidature.evaluationCarboneSimplifiée,
    actionnariat: candidature.actionnariat?.formatter(),
    dateÉchéanceGf: candidature.dateÉchéanceGf?.date,
    localité: {
      adresse1: candidature.localité.adresse1,
      adresse2: candidature.localité.adresse2,
      codePostal: candidature.localité.codePostal,
      commune: candidature.localité.commune,
    },
  },
  estNotifiée: !!candidature.notification,
});
