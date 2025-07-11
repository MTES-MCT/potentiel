import { Metadata, ResolvingMetadata } from 'next';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { getPériodeAppelOffres, getCandidature } from '@/app/_helpers';

import { CorrigerCandidaturePage, CorrigerCandidaturePageProps } from './CorrigerCandidature.page';

type PageProps = IdentifiantParameter;

export async function generateMetadata(
  { params }: IdentifiantParameter,
  _: ResolvingMetadata,
): Promise<Metadata> {
  try {
    const identifiantProjet = decodeParameter(params.identifiant);
    const candidature = await getCandidature(identifiantProjet);

    return {
      title: `Candidature ${candidature.nomProjet} - Potentiel`,
      description: 'Corriger la candidature',
    };
  } catch {
    return {};
  }
}

export default async function Page({ params }: PageProps) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(params.identifiant);
    const candidature = await getCandidature(identifiantProjet);
    const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
      type: 'Lauréat.Query.ConsulterLauréat',
      data: {
        identifiantProjet,
      },
    });

    const { appelOffres, période } = await getPériodeAppelOffres(candidature.identifiantProjet);
    const props = mapToProps(candidature, lauréat, appelOffres, période);

    return (
      <CorrigerCandidaturePage
        candidature={props.candidature}
        aUneAttestation={props.aUneAttestation}
        estNotifiée={props.estNotifiée}
        estLauréat={props.estLauréat}
        champsSupplémentaires={props.champsSupplémentaires}
        unitéPuissance={props.unitéPuissance}
      />
    );
  });
}
type MapToProps = (
  candidature: Candidature.ConsulterCandidatureReadModel,
  lauréat: Option.Type<Lauréat.ConsulterLauréatReadModel>,
  appelOffres: AppelOffre.AppelOffreReadModel,
  période: AppelOffre.Periode,
) => CorrigerCandidaturePageProps;

const mapToProps: MapToProps = (candidature, lauréat, appelOffres, période) => ({
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
    coefficientKChoisi: candidature.coefficientKChoisi,
  },
  estNotifiée: !!candidature.notification,
  aUneAttestation: !!candidature.notification?.attestation,
  estLauréat: Option.isSome(lauréat),
  unitéPuissance: candidature.unitéPuissance.formatter(),
  champsSupplémentaires: {
    ...appelOffres.champsSupplémentaires,
    ...période.champsSupplémentaires,
  },
});
