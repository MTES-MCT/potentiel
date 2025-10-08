import { Metadata } from 'next';

import { CahierDesCharges, Candidature } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { decodeParameter } from '@/utils/decodeParameter';
import { getCandidature, getCahierDesCharges } from '@/app/_helpers';

import { GetLauréat, getLauréat } from '../../_helpers/getLauréat';

import { ModifierLauréatPage, ModifierLauréatPageProps } from './ModifierLauréat.page';

export const metadata: Metadata = {
  title: 'Modification du projet lauréat - Potentiel',
  description: 'Modification du projet lauréat',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async () => {
      const identifiantProjet = decodeParameter(identifiant);
      const candidature = await getCandidature(identifiantProjet);

      const lauréat = await getLauréat({ identifiantProjet });
      const cahierDesCharges = await getCahierDesCharges(candidature.identifiantProjet);

      const props = mapToProps(candidature, lauréat, cahierDesCharges);

      return (
        <ModifierLauréatPage
          candidature={props.candidature}
          lauréat={props.lauréat}
          projet={props.projet}
          cahierDesCharges={props.cahierDesCharges}
        />
      );
    }),
  );
}

type MapToProps = (
  candidature: Candidature.ConsulterCandidatureReadModel,
  lauréat: GetLauréat,
  cahierDesCharges: CahierDesCharges.ValueType,
) => ModifierLauréatPageProps;

const mapToProps: MapToProps = (candidature, lauréat, cahierDesCharges) => ({
  candidature: {
    actionnaire: candidature.dépôt.sociétéMère,
    nomRepresentantLegal: candidature.dépôt.nomReprésentantLégal,
    technologie: candidature.dépôt.technologie.type,
    emailContact: candidature.dépôt.emailContact.email,
    evaluationCarboneSimplifiee: candidature.dépôt.evaluationCarboneSimplifiée,
    nomCandidat: candidature.dépôt.nomCandidat,
    prixReference: candidature.dépôt.prixReference,
    noteTotale: candidature.instruction.noteTotale,
    nomProjet: candidature.dépôt.nomProjet,
    adresse1: candidature.dépôt.localité.adresse1,
    adresse2: candidature.dépôt.localité.adresse2,
    codePostal: candidature.dépôt.localité.codePostal,
    commune: candidature.dépôt.localité.commune,
    departement: candidature.dépôt.localité.département,
    region: candidature.dépôt.localité.région,
    actionnariat: candidature.dépôt.actionnariat?.type,
    puissanceALaPointe: candidature.dépôt.puissanceALaPointe,
    puissanceProductionAnnuelle: candidature.dépôt.puissanceProductionAnnuelle,
    coefficientKChoisi: candidature.dépôt.coefficientKChoisi,
    puissanceDeSite: candidature.dépôt.puissanceDeSite,
    numeroDAutorisationDUrbanisme: candidature.dépôt.autorisationDUrbanisme?.numéro,
    dateDAutorisationDUrbanisme: candidature.dépôt.autorisationDUrbanisme?.date.formatter(),
    installateur: candidature.dépôt.installateur,
    natureDeLExploitation: candidature.dépôt.natureDeLExploitation
      ? candidature.dépôt.natureDeLExploitation.type
      : undefined,
  },
  lauréat: {
    statut: mapToPlainObject(lauréat.lauréat.statut),
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
    nomCandidat: {
      currentValue: lauréat.producteur.producteur,
      estEnCoursDeModification: false,
    },
    evaluationCarboneSimplifiee: {
      currentValue: lauréat.fournisseur.évaluationCarboneSimplifiée,
      estEnCoursDeModification: false,
    },
    installateur: lauréat.installateur
      ? {
          currentValue: lauréat.installateur.installateur,
          estEnCoursDeModification: false,
        }
      : undefined,
    natureDeLExploitation: lauréat.natureDeLExploitation
      ? {
          currentValue: lauréat.natureDeLExploitation.natureDeLExploitation.type,
          estEnCoursDeModification: false,
        }
      : undefined,
  },
  projet: {
    nomProjet: candidature.dépôt.nomProjet,
    identifiantProjet: candidature.identifiantProjet.formatter(),
    unitéPuissance: candidature.unitéPuissance.formatter(),
  },
  cahierDesCharges: mapToPlainObject(cahierDesCharges),
});
