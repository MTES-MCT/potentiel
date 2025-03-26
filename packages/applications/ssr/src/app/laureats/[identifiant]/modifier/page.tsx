import { Metadata } from 'next';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/projet';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { decodeParameter } from '@/utils/decodeParameter';
import {
  ModifierLauréatPage,
  ModifierLauréatPageProps,
} from '@/components/pages/lauréat/modifier/ModifierLauréat.page';
import { getPériodeAppelOffres } from '@/app/_helpers/getPériodeAppelOffres';

import { getCandidature } from '../../../candidatures/_helpers/getCandidature';
import { GetLauréat, getLauréat } from '../_helpers/getLauréat';

export const metadata: Metadata = {
  title: 'Page de modification du projet lauréat - Potentiel',
  description: 'Page de modification du projet lauréat',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async () => {
      const identifiantProjet = decodeParameter(identifiant);
      const candidature = await getCandidature(identifiantProjet);
      const lauréat = await getLauréat({ identifiantProjet });
      const { appelOffres, période } = await getPériodeAppelOffres(candidature.identifiantProjet);

      const props = mapToProps(candidature, lauréat, appelOffres, période);

      return (
        <ModifierLauréatPage
          candidature={props.candidature}
          lauréat={props.lauréat}
          projet={props.projet}
          champsSpéciaux={props.champsSpéciaux}
        />
      );
    }),
  );
}

type MapToProps = (
  candidature: Candidature.ConsulterCandidatureReadModel,
  lauréat: GetLauréat,
  appelOffres: AppelOffre.AppelOffreReadModel,
  période: AppelOffre.Periode,
) => ModifierLauréatPageProps;

const mapToProps: MapToProps = (candidature, lauréat, appelOffres, période) => ({
  candidature: {
    actionnaire: candidature.sociétéMère,
    nomRepresentantLegal: candidature.nomReprésentantLégal,
    technologie: candidature.technologie.type,
    emailContact: candidature.emailContact.email,
    evaluationCarboneSimplifiee: candidature.evaluationCarboneSimplifiée,
    nomCandidat: candidature.nomCandidat,
    prixReference: candidature.prixReference,
    noteTotale: candidature.noteTotale,
    nomProjet: candidature.nomProjet,
    adresse1: candidature.localité.adresse1,
    adresse2: candidature.localité.adresse2,
    codePostal: candidature.localité.codePostal,
    commune: candidature.localité.commune,
    departement: candidature.localité.département,
    region: candidature.localité.région,
    actionnariat: candidature.actionnariat?.type,
    puissanceALaPointe: candidature.puissanceALaPointe,
    puissanceProductionAnnuelle: candidature.puissanceProductionAnnuelle,
    coefficientKChoisi: candidature.coefficientKChoisi,
  },
  lauréat: {
    actionnaire: {
      currentValue: lauréat.actionnaire.actionnaire,
      estEnCoursDeModification: !!lauréat.actionnaire.dateDemandeEnCours,
    },
    nomRepresentantLegal: {
      currentValue: lauréat.représentantLégal.nomReprésentantLégal,
      estEnCoursDeModification: !!lauréat.représentantLégal.demandeEnCours,
    },
    nomProjet: {
      currentValue: lauréat.lauréat.nomProjet,
      estEnCoursDeModification: false,
    },
    adresse1: {
      currentValue: lauréat.lauréat.localité.adresse1,
      estEnCoursDeModification: false,
    },
    adresse2: {
      currentValue: lauréat.lauréat.localité.adresse2,
      estEnCoursDeModification: false,
    },
    codePostal: {
      currentValue: lauréat.lauréat.localité.codePostal,
      estEnCoursDeModification: false,
    },
    commune: {
      currentValue: lauréat.lauréat.localité.commune,
      estEnCoursDeModification: false,
    },
    departement: {
      currentValue: lauréat.lauréat.localité.département,
      estEnCoursDeModification: false,
    },
    region: {
      currentValue: lauréat.lauréat.localité.région,
      estEnCoursDeModification: false,
    },
    puissanceProductionAnnuelle: {
      currentValue: lauréat.puissance.puissance,
      estEnCoursDeModification: !!lauréat.puissance.dateDemandeEnCours,
    },
  },
  projet: {
    nomProjet: candidature.nomProjet,
    identifiantProjet: candidature.identifiantProjet.formatter(),
    isPPE2: appelOffres.cycleAppelOffre === 'PPE2',
  },
  champsSpéciaux: {
    coefficientKChoisi: période.choixCoefficientKDisponible ?? false,
    puissanceALaPointe: appelOffres.puissanceALaPointeDisponible ?? false,
  },
});
