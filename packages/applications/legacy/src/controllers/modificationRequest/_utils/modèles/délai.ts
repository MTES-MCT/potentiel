import {
  formatDateForDocument,
  type ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { formatIdentifiantProjetForDocument } from '../formatIdentifiantProjetForDocument';
import { Option } from '@potentiel-libraries/monads';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { getEnCopies } from '../getEnCopies';

export type DemandePrécédente = {
  dateDepotDemandePrecedente: Date;
  dateReponseDemandePrecedente: Date;
  autreDelaiDemandePrecedenteAccorde: boolean;
} & (
  | {
      demandeEnDate: true;
      demandeEnMois?: undefined;
      dateDemandePrecedenteDemandée: Date;
      dateDemandePrecedenteAccordée: Date;
    }
  | ({
      demandeEnDate?: undefined;
      demandeEnMois: true;
      dureeDelaiDemandePrecedenteEnMois: number;
    } & (
      | {
          demandeEnMoisAccordéeEnDate: true;
          dateDemandePrecedenteAccordée: Date;
        }
      | {
          demandeEnMoisAccordéeEnDate?: undefined;
          delaiDemandePrecedenteAccordeEnMois: number;
        }
    ))
);

type MapToDélaiModèleRéponseProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  lauréat: Lauréat.ConsulterLauréatReadModel;
  appelOffres: AppelOffre.ConsulterAppelOffreReadModel;
  cahierDesChargesChoisi: Lauréat.ConsulterCahierDesChargesChoisiReadModel;
  représentantLégal: Option.Type<Lauréat.ReprésentantLégal.ConsulterReprésentantLégalReadModel>;
  puissanceActuelle: number;
  dateAchèvementDemandée: Date;
  dateLimiteAchevementActuelle: Date;
  dateLimiteAchevementInitiale: Date;
  justification: string;
  utilisateur: Pick<Utilisateur.ValueType, 'nom' | 'région'>;
  dateDemande: Date;
  demandePrécédente?: DemandePrécédente;
};

export const mapToDélaiModèleRéponseProps = ({
  identifiantProjet,
  lauréat,
  appelOffres,
  cahierDesChargesChoisi,
  justification,
  représentantLégal,
  utilisateur,
  dateDemande,
  puissanceActuelle,
  dateAchèvementDemandée,
  dateLimiteAchevementActuelle,
  dateLimiteAchevementInitiale,
  demandePrécédente,
}: MapToDélaiModèleRéponseProps): ModèleRéponseSignée.ModèleRéponseDélai['data'] => {
  const période = appelOffres.periodes.find((période) => période.id === identifiantProjet.période);
  const paragraphe = getDonnéesCourriersRéponse({
    appelOffres,
    période: identifiantProjet.période,
    cahierDesChargesChoisi,
  });

  const régionDreal = Option.isSome(utilisateur.région) ? utilisateur.région : '';

  const donnéesDélai: ModèleRéponseSignée.ModèleRéponseDélai['data'] = {
    // Données projet
    adresseCandidat: [
      lauréat.localité.adresse1,
      lauréat.localité.adresse2,
      `${lauréat.localité.codePostal} ${lauréat.localité.commune}`,
    ]
      .filter(Boolean)
      .join('\n'),
    codePostalProjet: lauréat.localité.codePostal,
    communeProjet: lauréat.localité.commune,
    dateNotification: formatDateForDocument(lauréat.notifiéLe.date),
    familles: identifiantProjet.famille ? ('yes' as const) : ('' as const),
    dreal: régionDreal,
    email: lauréat.emailContact.formatter(),
    nomCandidat: lauréat.nomCandidat,
    nomProjet: lauréat.nomProjet,
    nomRepresentantLegal: Option.match(représentantLégal)
      .some((rl) => rl.nomReprésentantLégal)
      .none(() => ''),
    refPotentiel: formatIdentifiantProjetForDocument(identifiantProjet),
    titreAppelOffre: appelOffres.title,
    titreFamille:
      période?.familles.find((famille) => famille.id === identifiantProjet.famille)?.id || '',
    titrePeriode: période?.title || '',
    puissance: puissanceActuelle.toString(),
    unitePuissance: lauréat.unitéPuissance.formatter(),

    // Demande
    dateDemande: formatDateForDocument(dateDemande),
    justificationDemande: justification,
    enCopies: getEnCopies(lauréat.localité.région),
    suiviPar: utilisateur.nom,
    suiviParEmail: appelOffres.dossierSuiviPar,

    // Spécifique délai
    contenuParagrapheAchevement: paragraphe.dispositions,
    referenceParagrapheAchevement: paragraphe.référenceParagraphe,
    dateAchèvementDemandée: formatDateForDocument(dateAchèvementDemandée),

    dateLimiteAchevementActuelle: formatDateForDocument(dateLimiteAchevementActuelle),
    dateLimiteAchevementInitiale: formatDateForDocument(dateLimiteAchevementInitiale),
    demandePrecedente: '',
  };

  if (demandePrécédente) {
    const donnéesDemandePrécédente = {
      ...donnéesDélai,
      demandePrecedente: 'yes' as const,
      dateDepotDemandePrecedente: formatDateForDocument(
        demandePrécédente.dateDepotDemandePrecedente,
      ),
      dateReponseDemandePrecedente: formatDateForDocument(
        demandePrécédente.dateReponseDemandePrecedente,
      ),
      autreDelaiDemandePrecedenteAccorde: demandePrécédente.autreDelaiDemandePrecedenteAccorde
        ? ('yes' as const)
        : ('' as const),
    };
    if (demandePrécédente.demandeEnDate) {
      return {
        ...donnéesDemandePrécédente,

        demandeEnDate: 'yes',
        dateDemandePrecedenteDemandée: formatDateForDocument(
          demandePrécédente.dateDemandePrecedenteDemandée,
        ),
        dateDemandePrecedenteAccordée: formatDateForDocument(
          demandePrécédente.dateDemandePrecedenteAccordée,
        ),
      };
    }
    if (demandePrécédente.demandeEnMois) {
      if (demandePrécédente.demandeEnMoisAccordéeEnDate) {
        return {
          ...donnéesDemandePrécédente,

          demandeEnMois: 'yes',
          dureeDelaiDemandePrecedenteEnMois:
            demandePrécédente.dureeDelaiDemandePrecedenteEnMois.toString(),

          demandeEnMoisAccordéeEnDate: 'yes',
          dateDemandePrecedenteAccordée: formatDateForDocument(
            demandePrécédente.dateDemandePrecedenteAccordée,
          ),
        };
      }
      return {
        ...donnéesDemandePrécédente,

        demandeEnMois: 'yes',
        dureeDelaiDemandePrecedenteEnMois:
          demandePrécédente.dureeDelaiDemandePrecedenteEnMois.toString(),

        delaiDemandePrecedenteAccordeEnMois:
          demandePrécédente.delaiDemandePrecedenteAccordeEnMois.toString(),
      };
    }
  }

  return donnéesDélai;
};

const getDonnéesCourriersRéponse = ({
  appelOffres,
  période,
  cahierDesChargesChoisi,
}: {
  appelOffres: AppelOffre.AppelOffreReadModel;
  période: string;
  cahierDesChargesChoisi: Lauréat.ConsulterCahierDesChargesChoisiReadModel;
}): AppelOffre.DonnéesCourriersRéponse['texteDélaisDAchèvement'] => {
  const périodeDetails = appelOffres.periodes.find((periode) => periode.id === période);

  return {
    référenceParagraphe: '!!!REFERENCE NON DISPONIBLE!!!',
    dispositions: '!!!CONTENU NON DISPONIBLE!!!',
    ...appelOffres.donnéesCourriersRéponse.texteDélaisDAchèvement,
    ...périodeDetails?.donnéesCourriersRéponse?.texteDélaisDAchèvement,
    ...(cahierDesChargesChoisi.type === 'initial'
      ? {}
      : cahierDesChargesChoisi.donnéesCourriersRéponse?.texteDélaisDAchèvement),
  };
};
