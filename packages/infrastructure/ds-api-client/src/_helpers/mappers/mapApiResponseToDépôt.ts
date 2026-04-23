import { Candidature } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';

import { createDossierAccessor, GetDossierQuery } from '../../graphql/index.js';
import {
  getTypeGarantiesFinancières,
  getDateConstitutionGarantiesFinancières,
  getHistoriqueAbandon,
  getLocalité,
  getDispositifDeStockage,
  getTypologieInstallation,
  getAutorisation,
  getFournisseurs,
  getRaccordements,
  getNatureDeLExploitation,
  getTypeActionnariat,
} from '../getters/index.js';
import { DeepPartial } from '../types.js';
import { getNuméroImmatriculation } from '../getters/getNuméroImmatriculation.js';

const colonnes = {
  nomCandidat: 'Nom du candidat',
  sociétéMère: `Nom de la société mère finale`,
  nomReprésentantLégal: `NOM et Prénom du représentant légal`,
  emailContact: 'Adresse électronique du contact',
  nomProjet: 'Nom du projet',
  puissance: 'Puissance installée',
  puissanceDeSite: 'Puissance P+Q',
  prixReference: 'Prix unitaire de référence',
  evaluationCarboneSimplifiée: 'Évaluation carbone simplifiée',

  typeGarantiesFinancières: "Type de garantie financière d'exécution",

  localité: 'Adresse postale du site de production',
  historiqueAbandon: "Le projet a-t-il fait l'objet d'une candidature précédemment ?",

  obligationDeSolarisation: `Projet réalisé dans le cadre d'une obligation de solarisation`,

  installateur: "Identité de l'installateur",
  coefficientKChoisi: "Souhaitez-vous bénéficier de l'indexation K ?",
} satisfies Partial<Record<keyof Candidature.Dépôt.RawType, string>>;

type MapApiResponseToDépôt = {
  champs: GetDossierQuery['dossier']['champs'];
};

export const mapApiResponseToDépôt = ({
  champs,
}: MapApiResponseToDépôt): DeepPartial<Candidature.Dépôt.RawType> => {
  const accessor = createDossierAccessor(champs, colonnes);
  const accessorAutorisation = createDossierAccessor(champs, {
    numéro: "Numéro de l'autorisation",
    date: "Date d'obtention de l'autorisation",
  } satisfies Record<keyof Candidature.Dépôt.RawType['autorisation'], string>);

  const accessorDispositifDeStockage = createDossierAccessor(champs, {
    installationAvecDispositifDeStockage:
      "L'Installation est-elle couplée à un dispositif de stockage ?",
    capacitéDuDispositifDeStockageEnKWh: 'Capacité du dispositif de stockage',
    puissanceDuDispositifDeStockageEnKW: 'Puissance du dispositif de stockage',
  } satisfies Record<keyof Candidature.Dépôt.RawType['dispositifDeStockage'], string>);

  const accessorNatureDeLExploitation = createDossierAccessor(champs, {
    tauxPrévisionnelACI: "Taux d'autoconsommation individuelle (ACI) prévisionnel",
    tauxPrévisionnelACC: "Taux d'autoconsommation collective (ACC) prévisionnel",
  } satisfies Record<keyof Candidature.Dépôt.RawType['natureDeLExploitation'], string>);

  const accessorTypeActionnariat = createDossierAccessor(champs, {
    gouvernancePartagée: "Le projet fait-il l'objet d'un engagement à la gouvernance partagée ?",
    financementCollectif: "Le projet fait-il l'objet d'un engagement au financement collectif ?",
  } satisfies Record<string, string>);

  const accessorNuméroImmatriculation = createDossierAccessor(champs, {
    numéroSIREN: 'Numéro SIREN du candidat',
    numéroSIRET: 'Numéro SIRET du candidat',
  }) satisfies Record<keyof Candidature.Dépôt.RawType['numéroImmatriculation'], string>;

  const typeGarantiesFinancieres = getTypeGarantiesFinancières(
    accessor,
    'typeGarantiesFinancières',
  );

  const dateConstitutionGarantiesFinancieres = getDateConstitutionGarantiesFinancières(
    typeGarantiesFinancieres,
    champs,
  );

  const getDateÉchéanceGarantiesFinancières = (date: string) => {
    const délaiÉchéanceGarantieBancaireEnMois = appelsOffreData.find(
      (ao) => ao.id === 'PPE2 - Petit PV Bâtiment',
    )?.garantiesFinancières.délaiÉchéanceGarantieBancaireEnMois;

    return délaiÉchéanceGarantieBancaireEnMois
      ? DateTime.convertirEnValueType(date)
          .ajouterNombreDeMois(délaiÉchéanceGarantieBancaireEnMois)
          .formatter()
      : undefined;
  };

  return {
    //  1. Renseignements administratifs
    nomCandidat: accessor.getStringValue('nomCandidat'),
    sociétéMère: accessor.getStringValue('sociétéMère'),
    nomReprésentantLégal: accessor.getStringValue('nomReprésentantLégal'),
    emailContact: accessor.getStringValue('emailContact'),

    //  2. Identification du projet
    nomProjet: accessor.getStringValue('nomProjet'),
    puissance: accessor.getNumberValue('puissance'),
    puissanceDeSite: accessor.getNumberValue('puissanceDeSite'),

    prixReference: accessor.getNumberValue('prixReference'),
    evaluationCarboneSimplifiée: accessor.getNumberValue('evaluationCarboneSimplifiée'),

    typeGarantiesFinancières: typeGarantiesFinancieres,
    dateConstitutionGf: dateConstitutionGarantiesFinancieres,
    dateÉchéanceGf:
      typeGarantiesFinancieres === 'avec-date-échéance' && dateConstitutionGarantiesFinancieres
        ? getDateÉchéanceGarantiesFinancières(dateConstitutionGarantiesFinancieres)
        : undefined,
    historiqueAbandon: getHistoriqueAbandon(accessor, 'historiqueAbandon'),

    obligationDeSolarisation: accessor.getBooleanValue('obligationDeSolarisation'),
    coefficientKChoisi: accessor.getBooleanValue('coefficientKChoisi'),

    localité: getLocalité(accessor, 'localité'),

    dispositifDeStockage: getDispositifDeStockage({
      accessor: accessorDispositifDeStockage,
      nomChampsInstallation: 'installationAvecDispositifDeStockage',
      nomChampCapacité: 'capacitéDuDispositifDeStockageEnKWh',
      nomChampPuissance: 'puissanceDuDispositifDeStockageEnKW',
    }),

    installateur: accessor.getStringValue('installateur'),

    natureDeLExploitation: getNatureDeLExploitation({
      accessor: accessorNatureDeLExploitation,
      nomChampTauxPrévisionnelACI: 'tauxPrévisionnelACI',
      nomChampTauxPrévisionnelACC: 'tauxPrévisionnelACC',
    }),

    autorisation: getAutorisation({
      accessor: accessorAutorisation,
      nomChampNuméro: 'numéro',
      nomChampDate: 'date',
    }),

    typologieInstallation: getTypologieInstallation(champs),

    fournisseurs: getFournisseurs(champs),

    actionnariat: getTypeActionnariat({
      accessor: accessorTypeActionnariat,
      nomChampFinancementCollectif: 'financementCollectif',
      nomChampGouvernancePartagée: 'gouvernancePartagée',
    }),

    raccordements: getRaccordements(champs),

    numéroImmatriculation: getNuméroImmatriculation({
      accessor: accessorNuméroImmatriculation,
      nomChampsNuméroSIREN: 'numéroSIREN',
      nomChampsNuméroSIRET: 'numéroSIRET',
    }),

    // Non disponibles sur Démarches simplifiées
    puissanceALaPointe: undefined,
    territoireProjet: undefined,
    technologie: 'N/A',
  };
};
