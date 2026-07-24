import type { Candidature } from '@potentiel-domain/projet';

import { createDossierAccessor, type GetDossierQuery } from '../../graphql/index.js';
import { getCoordonnées } from '../getters/getCoordonnées.js';
import { getDateÉchéanceGarantiesFinancières } from '../getters/getDateÉchéanceGarantiesFinancières.js';
import { getNuméroIdentification } from '../getters/getNuméroIdentification.js';
import { getPuissanceInstallée } from '../getters/getPuissance.js';
import {
  getAutorisation,
  getDateConstitutionGarantiesFinancières,
  getDispositifDeStockage,
  getFournisseurs,
  getHistoriqueAbandon,
  getLocalité,
  getNatureDeLExploitation,
  getRaccordements,
  getTypeActionnariat,
  getTypeGarantiesFinancières,
  getTypologieInstallation,
} from '../getters/index.js';
import type { DeepPartial } from '../types.js';

const colonnes = {
  nomCandidat: 'Nom du candidat',
  sociétéMère: `Nom de la société mère finale`,
  nomReprésentantLégal: `NOM et Prénom du représentant légal`,
  emailContact: 'Adresse électronique du contact',
  nomProjet: 'Nom du projet',
  puissanceDuProjetInitial: 'Puissance initiale du parc',
  puissanceDeSite: 'Puissance P+Q',
  prixReference: 'Prix unitaire de référence',
  evaluationCarboneSimplifiée: 'Évaluation carbone simplifiée',

  typeGarantiesFinancières: "Type de garantie financière d'exécution",
  dateÉchéanceGf: "Date d'échéance",

  localité: 'Adresse postale du site de production',
  historiqueAbandon: 'Préciser le statut du projet',

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

  const accessorPuissance = createDossierAccessor(champs, {
    puissanceInstallée: 'Puissance installée',
    puissanceInstalléeP: 'Puissance installée P',
  } satisfies Record<string, string>);

  const accessorTypeActionnariat = createDossierAccessor(champs, {
    gouvernancePartagée: "Le projet fait-il l'objet d'un engagement à la gouvernance partagée ?",
    financementCollectif: "Le projet fait-il l'objet d'un engagement au financement collectif ?",
  } satisfies Record<string, string>);

  const accessorNuméroIdentification = createDossierAccessor(champs, {
    numéroSIREN: 'Numéro SIREN du candidat',
    numéroSIRET: 'Numéro SIRET du candidat',
  }) satisfies Record<keyof Candidature.Dépôt.RawType['numéroIdentification'], string>;

  const typeGarantiesFinancières = getTypeGarantiesFinancières(
    accessor,
    'typeGarantiesFinancières',
  );

  const dateConstitutionGarantiesFinancières = getDateConstitutionGarantiesFinancières(
    typeGarantiesFinancières,
    champs,
  );

  const dateÉchéanceGarantiesFinancieres = getDateÉchéanceGarantiesFinancières({
    typeGarantiesFinancières,
    dateConstitutionGarantiesFinancières,
    dateÉchéanceGarantiesFinancières: accessor.getDateValue('dateÉchéanceGf'),
  });

  const nomProjet = accessor.getStringValue('nomProjet');

  return {
    //  1. Renseignements administratifs
    nomCandidat: accessor.getStringValue('nomCandidat'),
    sociétéMère: accessor.getStringValue('sociétéMère'),
    nomReprésentantLégal: accessor.getStringValue('nomReprésentantLégal'),
    emailContact: accessor.getStringValue('emailContact'),

    //  2. Identification du projet
    nomProjet,
    puissance: getPuissanceInstallée({
      accessor: accessorPuissance,
      nomChampPuissanceInstallée: 'puissanceInstallée',
      nomChampPuissanceInstalléeP: 'puissanceInstalléeP',
    }),
    puissanceDeSite: accessor.getNumberValue('puissanceDeSite'),
    puissanceDuProjetInitial: accessor.getNumberValue('puissanceDuProjetInitial'),
    prixReference: accessor.getNumberValue('prixReference'),
    evaluationCarboneSimplifiée: accessor.getNumberValue('evaluationCarboneSimplifiée'),

    typeGarantiesFinancières:
      typeGarantiesFinancières === 'garantie-bancaire'
        ? 'avec-date-échéance'
        : typeGarantiesFinancières,
    dateConstitutionGf: dateConstitutionGarantiesFinancières,
    dateÉchéanceGf: dateÉchéanceGarantiesFinancieres,

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

    coordonnées: getCoordonnées(champs),

    numéroIdentification: getNuméroIdentification({
      accessor: accessorNuméroIdentification,
      nomChampsNuméroSIREN: 'numéroSIREN',
      nomChampsNuméroSIRET: 'numéroSIRET',
      nomProjet,
    }),

    // Non disponibles sur Démarche Numérique
    puissanceALaPointe: undefined,
    territoireProjet: undefined,
    technologie: 'N/A',
  };
};
