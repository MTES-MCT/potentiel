import { Candidature } from '@potentiel-domain/projet';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { GetDossierQuery, createDossierAccessor } from './graphql';
import {
  getTypeGarantiesFinancières,
  getHistoriqueAbandon,
  getLocalité,
  getTypologieBâtiment,
} from './specialFields';
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

  obligationDeSolarisation: `Projet réalisé dans le cadre d'une obligation de solarisation (loi APER)`,
  typologieDeBâtiment: 'Typologie secondaire du projet (Bâtiment)',
  élémentsSousOmbrière: "Préciser les éléments sous l'ombrière",
} satisfies Partial<Record<keyof Candidature.Dépôt.RawType, string>>;

export const mapApiResponseToDépôt = ({
  champs,
  demarche,
}: GetDossierQuery['dossier']): DeepPartial<Candidature.Dépôt.RawType> => {
  const accessor = createDossierAccessor(champs, colonnes, demarche.revision.champDescriptors);
  accessor.getStringValue('nomCandidat');
  const typeGarantiesFinancieres = getTypeGarantiesFinancières(
    accessor,
    'typeGarantiesFinancières',
  );
  return {
    //  1. Renseignements administratifs
    nomCandidat: accessor.getStringValue('nomCandidat'),
    sociétéMère: accessor.getStringValue('sociétéMère'),
    nomReprésentantLégal: accessor.getStringValue('nomReprésentantLégal'),
    emailContact: accessor.getStringValue('emailContact'),

    //  2. Identification du projet
    nomProjet: accessor.getStringValue('nomProjet'),
    puissanceProductionAnnuelle: accessor.getNumberValue('puissanceProductionAnnuelle'),
    // TODO Puissance du site p+q

    prixReference: accessor.getNumberValue('prixReference'),
    evaluationCarboneSimplifiée: accessor.getNumberValue('evaluationCarboneSimplifiée'),

    typeGarantiesFinancières: typeGarantiesFinancieres,
    dateDélibérationGf:
      typeGarantiesFinancieres === 'exemption'
        ? (accessor.getDateValue('dateDélibérationGf') as Iso8601DateTime)
        : undefined,
    historiqueAbandon: getHistoriqueAbandon(accessor, 'historiqueAbandon'),

    obligationDeSolarisation: accessor.getBooleanValue('obligationDeSolarisation'),
    typologieDeBâtiment: getTypologieBâtiment(accessor, 'typologieDeBâtiment'),
    // TODO typologieOmbrière
    élémentsSousOmbrière: accessor.getStringValue('élémentsSousOmbrière'),
    // TODO autorisation d'urbanisme

    // TODO quelle adresse choisir... site de production ?
    localité: getLocalité(accessor, 'localité'),

    // Non disponibles sur Démarche simplifiée
    typeInstallationsAgrivoltaiques: undefined,
    actionnariat: undefined,
    coefficientKChoisi: undefined,
    fournisseurs: [],
    puissanceALaPointe: undefined,
    territoireProjet: undefined,
    technologie: 'N/A',
  };
};
