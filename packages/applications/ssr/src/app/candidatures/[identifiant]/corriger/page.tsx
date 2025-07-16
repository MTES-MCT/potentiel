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
      title: `Candidature ${candidature.dépôt.nomProjet} - Potentiel`,
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

    statut: candidature.instruction.statut.formatter(),
    noteTotale: candidature.instruction.noteTotale,
    motifElimination: candidature.instruction.motifÉlimination,

    nomProjet: candidature.dépôt.nomProjet,
    nomCandidat: candidature.dépôt.nomCandidat,
    nomRepresentantLegal: candidature.dépôt.nomReprésentantLégal,
    emailContact: candidature.dépôt.emailContact.formatter(),
    puissanceProductionAnnuelle: candidature.dépôt.puissanceProductionAnnuelle,
    prixReference: candidature.dépôt.prixReference,
    societeMere: candidature.dépôt.sociétéMère,
    puissanceALaPointe: candidature.dépôt.puissanceALaPointe,
    evaluationCarboneSimplifiee: candidature.dépôt.evaluationCarboneSimplifiée,
    actionnariat: candidature.dépôt.actionnariat?.formatter(),
    adresse1: candidature.dépôt.localité.adresse1,
    adresse2: candidature.dépôt.localité.adresse2,
    codePostal: candidature.dépôt.localité.codePostal,
    commune: candidature.dépôt.localité.commune,
    departement: candidature.dépôt.localité.département,
    region: candidature.dépôt.localité.région,
    technologie: candidature.dépôt.technologie.formatter(),
    typeGarantiesFinancieres: candidature.dépôt.typeGarantiesFinancières?.type,
    dateEcheanceGf: candidature.dépôt.dateÉchéanceGf?.date,
    coefficientKChoisi: candidature.dépôt.coefficientKChoisi,
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
