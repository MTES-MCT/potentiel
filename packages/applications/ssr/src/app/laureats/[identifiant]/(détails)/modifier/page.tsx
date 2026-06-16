import type { Metadata } from 'next';

import { mapToPlainObject } from '@potentiel-domain/core';
import type { CahierDesCharges, Candidature, Lauréat } from '@potentiel-domain/projet';

import { getCahierDesCharges, getCandidature, getLauréatInfos } from '@/app/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  getActionnaireInfos,
  getFournisseurInfos,
  getProducteurInfos,
  getPuissanceInfos,
  getReprésentantLégalInfos,
} from '../../_helpers';
import { ModifierLauréatPage, type ModifierLauréatPageProps } from './ModifierLauréat.page';

export const metadata: Metadata = { title: 'Modifier le projet' };

export default async function Page(props0: IdentifiantParameter) {
  const params = await props0.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async () => {
      const identifiantProjet = decodeParameter(identifiant);
      const candidature = await getCandidature(identifiantProjet);
      const lauréat = await getLauréatInfos(identifiantProjet);
      const actionnaire = await getActionnaireInfos(identifiantProjet);
      const représentantLégal = await getReprésentantLégalInfos(identifiantProjet);
      const puissance = await getPuissanceInfos(identifiantProjet);
      const producteur = await getProducteurInfos(identifiantProjet);
      const fournisseur = await getFournisseurInfos(identifiantProjet);
      const cahierDesCharges = await getCahierDesCharges(identifiantProjet);

      const props = mapToProps({
        candidature,
        lauréat,
        actionnaire,
        représentantLégal,
        puissance,
        producteur,
        fournisseur,
        cahierDesCharges,
      });

      return (
        <ModifierLauréatPage
          candidature={props.candidature}
          lauréat={props.lauréat}
          projet={props.projet}
          cahierDesCharges={props.cahierDesCharges}
          peutRegénérerAttestation={props.peutRegénérerAttestation}
        />
      );
    }),
  );
}

type MapToProps = (args: {
  candidature: Candidature.ConsulterCandidatureReadModel;
  actionnaire: Lauréat.Actionnaire.ConsulterActionnaireReadModel;
  représentantLégal: Lauréat.ReprésentantLégal.ConsulterReprésentantLégalReadModel;
  puissance: Lauréat.Puissance.ConsulterPuissanceReadModel;
  producteur: Lauréat.Producteur.ConsulterProducteurReadModel;
  lauréat: Lauréat.ConsulterLauréatReadModel;
  fournisseur: Lauréat.Fournisseur.ConsulterFournisseurReadModel;
  cahierDesCharges: CahierDesCharges.ValueType;
}) => ModifierLauréatPageProps;

const mapToProps: MapToProps = ({
  candidature,
  lauréat,
  actionnaire,
  représentantLégal,
  puissance,
  producteur,
  fournisseur,
  cahierDesCharges,
}) => ({
  candidature: {
    sociétéMère: candidature.dépôt.sociétéMère,
    nomReprésentantLégal: candidature.dépôt.nomReprésentantLégal,
    technologie: candidature.dépôt.technologie.type,
    emailContact: candidature.dépôt.emailContact.email,
    evaluationCarboneSimplifiée: candidature.dépôt.evaluationCarboneSimplifiée,
    nomCandidat: candidature.dépôt.nomCandidat,
    prixReference: candidature.dépôt.prixReference,
    noteTotale: candidature.instruction.noteTotale,
    nomProjet: candidature.dépôt.nomProjet,
    adresse1: candidature.dépôt.localité.adresse1,
    adresse2: candidature.dépôt.localité.adresse2,
    codePostal: candidature.dépôt.localité.codePostal,
    commune: candidature.dépôt.localité.commune,
    département: candidature.dépôt.localité.département,
    région: candidature.dépôt.localité.région,
    actionnariat: candidature.dépôt.actionnariat?.type,
    puissanceALaPointe: candidature.dépôt.puissanceALaPointe,
    puissance: candidature.dépôt.puissance,
    coefficientKChoisi: candidature.dépôt.coefficientKChoisi,
    puissanceDeSite: candidature.dépôt.puissanceDeSite,
    numéroDAutorisation: candidature.dépôt.autorisation?.numéro,
    dateDAutorisation: candidature.dépôt.autorisation?.date.formatter(),
    installateur: candidature.dépôt.installateur,
  },
  lauréat: {
    statut: mapToPlainObject(lauréat.statut),
    sociétéMère: {
      currentValue: actionnaire.actionnaire,
      estEnCoursDeModification: actionnaire.aUneDemandeEnCours,
    },
    nomReprésentantLégal: {
      currentValue: représentantLégal.nomReprésentantLégal,
      estEnCoursDeModification: représentantLégal.aUneDemandeEnCours,
    },
    nomProjet: {
      currentValue: lauréat.nomProjet,
      estEnCoursDeModification: false,
    },
    adresse1: {
      currentValue: lauréat.localité.adresse1,
      estEnCoursDeModification: false,
    },
    adresse2: {
      currentValue: lauréat.localité.adresse2,
      estEnCoursDeModification: false,
    },
    codePostal: {
      currentValue: lauréat.localité.codePostal,
      estEnCoursDeModification: false,
    },
    commune: {
      currentValue: lauréat.localité.commune,
      estEnCoursDeModification: false,
    },
    département: {
      currentValue: lauréat.localité.département,
      estEnCoursDeModification: false,
    },
    région: {
      currentValue: lauréat.localité.région,
      estEnCoursDeModification: false,
    },
    puissance: {
      currentValue: puissance.puissance,
      estEnCoursDeModification: puissance.aUneDemandeEnCours,
    },
    puissanceDeSite: {
      currentValue: puissance.puissanceDeSite,
      estEnCoursDeModification: puissance.aUneDemandeEnCours,
    },
    nomCandidat: {
      currentValue: producteur.producteur,
      estEnCoursDeModification: false,
    },
    evaluationCarboneSimplifiée: {
      currentValue: fournisseur.évaluationCarboneSimplifiée,
      estEnCoursDeModification: false,
    },
  },
  projet: {
    nomProjet: candidature.dépôt.nomProjet,
    identifiantProjet: candidature.identifiantProjet.formatter(),
    unitéPuissance: candidature.unitéPuissance.formatter(),
  },
  cahierDesCharges: mapToPlainObject(cahierDesCharges),
  peutRegénérerAttestation: cahierDesCharges.période.type !== 'legacy',
});
