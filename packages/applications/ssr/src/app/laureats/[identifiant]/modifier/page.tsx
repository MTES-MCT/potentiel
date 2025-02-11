import { Metadata } from 'next';

import { Candidature } from '@potentiel-domain/candidature';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { decodeParameter } from '@/utils/decodeParameter';
import {
  ModifierLauréatPage,
  ModifierLauréatPageProps,
} from '@/components/pages/lauréat/modifier/ModifierLauréat.page';

import { getCandidature } from '../../../candidatures/_helpers/getCandidature';
import { GetLauréat, getLauréat } from '../_helpers/getLauréat';

export const metadata: Metadata = {
  title: 'Page de modification des lauréats - Potentiel',
  description: 'Page de modification des lauréats',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async () => {
      const identifiantProjet = decodeParameter(identifiant);
      const candidature = await getCandidature(identifiantProjet);
      const lauréat = await getLauréat({
        identifiantProjet,
      });

      const props = mapToProps(candidature, lauréat, identifiantProjet);

      return (
        <ModifierLauréatPage
          candidature={props.candidature}
          lauréat={props.lauréat}
          projet={props.projet}
        />
      );
    }),
  );
}

type MapToProps = (
  candidature: Candidature.ConsulterCandidatureReadModel,
  lauréat: GetLauréat,
  identifiantProjet: string,
) => ModifierLauréatPageProps;

const mapToProps: MapToProps = (candidature, lauréat, identifiantProjet) => ({
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
      currentValue: lauréat.puissance,
      // TODO: à changer après la migration de puissance
      estEnCoursDeModification: true,
    },
  },
  projet: {
    nomProjet: candidature.nomProjet,
    identifiantProjet,
    isCRE4ZNI:
      IdentifiantProjet.convertirEnValueType(identifiantProjet).appelOffre.startsWith('CRE4 - ZNI'),
    isPPE2: IdentifiantProjet.convertirEnValueType(identifiantProjet).appelOffre.startsWith('PPE2'),
  },
});
