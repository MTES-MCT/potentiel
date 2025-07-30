import { Candidature } from '@potentiel-domain/projet';

import {
  GetDossierQuery,
  getStringValue,
  getDecimalValue,
  getIntegerValue,
  getDateValue,
} from './graphql';
import { getTypeGarantiesFinancières, getHistoriqueAbandon, getLocalité } from './specialFields';
import { DeepPartial } from './utils';

const colonnes = {
  nomCandidat: 'Nom du candidat',
  sociétéMère: `Nom de l'entité mère`,
  nomReprésentantLégal: `NOM et Prénom du représentant légal`,
  emailContact: 'Adresse électronique du contact',
  nomProjet: 'Nom du projet',
  puissanceProductionAnnuelle: 'Puissance installée P (en kWc)',
  prixReference: 'Prix unitaire de référence (en €/MWh)',
  evaluationCarboneSimplifiée: 'Évaluation carbone simplifiée (ECS)',

  typeGarantiesFinancières: 'Type de garantie financière',
  dateÉchéanceGf: "Date d'échéance des garanties financières",
  dateDélibérationGf: "Date de la délibération portant sur le projet objet de l'offre",

  localité: 'Adresse postale',
  historiqueAbandon: 'Préciser le statut du projet',
} satisfies Partial<Record<keyof Candidature.Dépôt.RawType, string>>;

export const mapApiResponseToDépôt = ({
  champs,
}: GetDossierQuery['dossier']): DeepPartial<Candidature.Dépôt.RawType> => {
  const typeGarantiesFinancieres = getTypeGarantiesFinancières(
    champs,
    colonnes.typeGarantiesFinancières,
  );
  return {
    //  1. Renseignements administratifs
    nomCandidat: getStringValue(champs, colonnes.nomCandidat),
    sociétéMère: getStringValue(champs, colonnes.sociétéMère),
    nomReprésentantLégal: getStringValue(champs, colonnes.nomReprésentantLégal),
    emailContact: getStringValue(champs, colonnes.emailContact),

    //  2. Identification du projet
    nomProjet: getStringValue(champs, colonnes.nomProjet),
    puissanceProductionAnnuelle: getDecimalValue(champs, colonnes.puissanceProductionAnnuelle),
    // TODO Puissance du site p+q

    prixReference: getDecimalValue(champs, colonnes.prixReference),
    evaluationCarboneSimplifiée: getIntegerValue(champs, colonnes.evaluationCarboneSimplifiée),

    typeGarantiesFinancières: typeGarantiesFinancieres,
    dateDélibérationGf:
      typeGarantiesFinancieres === 'exemption'
        ? getDateValue(champs, colonnes.dateDélibérationGf)
        : undefined,
    historiqueAbandon: getHistoriqueAbandon(champs, colonnes.historiqueAbandon),

    // TODO
    obligationDeSolarisation: undefined,
    typeInstallationsAgrivoltaiques: undefined,
    typologieDeBâtiment: undefined,
    élémentsSousOmbrière: undefined,
    // TODO autorisation d'urbanisme

    // TODO quelle adresse choisir... site de production ?
    localité: getLocalité(champs, colonnes.localité),

    // Non disponibles sur Démarche simplifiée
    actionnariat: undefined,
    coefficientKChoisi: undefined,
    fournisseurs: [],
    puissanceALaPointe: undefined,
    territoireProjet: undefined,
    technologie: undefined,
  };
};
