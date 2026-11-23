import { match, P } from 'ts-pattern';

import type { Candidature } from '@potentiel-domain/projet';

import { createDossierAccessor, type GetDossierQuery } from '../../graphql/index.js';
import { getDateÉchéanceGarantiesFinancières } from '../getters/getDateÉchéanceGarantiesFinancières.js';
import { getNuméroIdentification } from '../getters/getNuméroIdentification.js';
import { getPuissanceInstallée } from '../getters/getPuissanceInstallée.js';
import {
  getAutorisation,
  getCoordonnées,
  getDateConstitutionGarantiesFinancières,
  getDispositifDeStockage,
  getFournisseurs,
  getHistoriqueAbandon,
  getLocalité,
  getNatureDeLExploitation,
  getRaccordements,
  getTechnologie,
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

  technologie: 'Typologie principale du projet',
} satisfies Partial<Record<keyof Candidature.Dépôt.RawType, string>>;

type MapApiResponseToDépôt = {
  champs: GetDossierQuery['dossier']['champs'];
};

type Result =
  | { valide: true; dépôt: Candidature.Dépôt.RawType }
  | { valide: false; erreurs: string[] };

export const mapApiResponseToDépôt = ({ champs }: MapApiResponseToDépôt): Result => {
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

  const accessorCoordonnées = createDossierAccessor(champs, {
    latitude: 'Latitude du barycentre',
    longitude: 'Longitude du barycentre',
  } satisfies Record<keyof Candidature.Dépôt.RawType['coordonnées'], string>);

  const clésDépôt = [
    'nomProjet',
    'nomCandidat',
    'emailContact',
    'sociétéMère',
    'nomReprésentantLégal',
    'prixReference',
    'localité',
    'coordonnées',
    'historiqueAbandon',
    'puissance',
    'puissanceALaPointe',
    'puissanceDeSite',
    'puissanceDuProjetInitial',
    'coefficientKChoisi',
    'evaluationCarboneSimplifiée',
    'technologie',
    'actionnariat',
    'typeGarantiesFinancières',
    'dateÉchéanceGf',
    'attestationConstitutionGf',
    'dateConstitutionGf',
    'territoireProjet',
    'fournisseurs',
    'typologieInstallation',
    'obligationDeSolarisation',
    'autorisation',
    'installateur',
    'dispositifDeStockage',
    'natureDeLExploitation',
    'raccordements',
    'numéroIdentification',
  ] as const satisfies readonly (keyof Candidature.Dépôt.RawType)[];

  const erreurs: string[] = [];
  const dépôt: DeepPartial<Candidature.Dépôt.RawType> = {};

  for (const clé of clésDépôt) {
    match(clé)
      .with(
        P.union('nomCandidat', 'nomCandidat', 'emailContact', 'nomProjet', 'nomReprésentantLégal'),
        (clé) => {
          const valeur = accessor.getStringValue(clé);
          if (!valeur) {
            erreurs.push(`Le champ ${clé} est requis`);
          }
          dépôt[clé] = valeur;
        },
      )
      .with(P.union('installateur', 'sociétéMère'), (clé) => {
        const valeur = accessor.getStringValue(clé);
        if (valeur) {
          dépôt[clé] = valeur;
        }
      })
      .with(P.union('prixReference', 'evaluationCarboneSimplifiée'), (clé) => {
        const valeur = accessor.getNumberValue(clé);
        if (!valeur) {
          erreurs.push(`Le champ ${clé} est requis`);
        }
        dépôt[clé] = valeur;
      })
      .with(P.union('puissanceDeSite', 'puissanceDuProjetInitial'), (clé) => {
        const valeur = accessor.getNumberValue(clé);
        if (valeur) {
          dépôt[clé] = valeur;
        }
        dépôt[clé] = valeur;
      })
      .with(P.union('coefficientKChoisi'), (clé) => {
        const valeur = accessor.getBooleanValue(clé);
        if (!valeur) {
          erreurs.push(`Le champ ${clé} est requis`);
        }
        dépôt[clé] = valeur;
      })
      .with(P.union('obligationDeSolarisation'), (clé) => {
        const valeur = accessor.getBooleanValue(clé);
        if (!valeur) {
          dépôt[clé] = valeur;
        }
      })
      .with(P.union('puissanceALaPointe', 'territoireProjet'), (clé) => {
        dépôt[clé] = undefined;
      })
      .with('autorisation', () => {
        dépôt['autorisation'] = getAutorisation({
          accessor: accessorAutorisation,
          nomChampDate: 'date',
          nomChampNuméro: 'numéro',
        });
      })
      .with('coordonnées', () => {
        dépôt['coordonnées'] = getCoordonnées({
          accessor: accessorCoordonnées,
          nomChampLatitude: 'latitude',
          nomChampLongitude: 'longitude',
        });
      })
      .with('dateConstitutionGf', () => {
        dépôt['dateConstitutionGf'] = getDateConstitutionGarantiesFinancières(champs);
      })
      .with('dateÉchéanceGf', () => {
        dépôt['dateÉchéanceGf'] = getDateÉchéanceGarantiesFinancières({
          dateConstitutionGarantiesFinancières: getDateConstitutionGarantiesFinancières(champs),
          typeGarantiesFinancières: getTypeGarantiesFinancières(
            accessor,
            'typeGarantiesFinancières',
          ),
        });
      })
      .with('dispositifDeStockage', () => {
        dépôt['dispositifDeStockage'] = getDispositifDeStockage({
          accessor: accessorDispositifDeStockage,
          nomChampsInstallation: 'installationAvecDispositifDeStockage',
          nomChampCapacité: 'capacitéDuDispositifDeStockageEnKWh',
          nomChampPuissance: 'puissanceDuDispositifDeStockageEnKW',
        });
      })
      .with('fournisseurs', () => {
        dépôt['fournisseurs'] = getFournisseurs(champs);
      })
      .with('historiqueAbandon', () => {
        dépôt['historiqueAbandon'] =
          getHistoriqueAbandon(accessor, 'historiqueAbandon') ?? 'première-candidature';
      })
      .with('localité', () => {
        dépôt['localité'] = getLocalité(accessor, 'localité');
      })
      .with('natureDeLExploitation', () => {
        dépôt['natureDeLExploitation'] = getNatureDeLExploitation({
          accessor: accessorNatureDeLExploitation,
          nomChampTauxPrévisionnelACI: 'tauxPrévisionnelACI',
          nomChampTauxPrévisionnelACC: 'tauxPrévisionnelACC',
        });
      })
      .with('numéroIdentification', () => {
        dépôt['numéroIdentification'] = getNuméroIdentification({
          accessor: accessorNuméroIdentification,
          nomChampsNuméroSIREN: 'numéroSIREN',
          nomChampsNuméroSIRET: 'numéroSIRET',
          nomProjet: accessor.getStringValue('nomProjet'),
        });
      })
      .with('puissance', () => {
        dépôt['puissance'] = getPuissanceInstallée({
          accessor: accessorPuissance,
          nomChampPuissanceInstallée: 'puissanceInstallée',
          nomChampPuissanceInstalléeP: 'puissanceInstalléeP',
        });
      })
      .with('raccordements', () => {
        dépôt['raccordements'] = getRaccordements(champs);
      })
      .with('technologie', () => {
        dépôt['technologie'] = getTechnologie(accessor, 'technologie');
      })
      .with('actionnariat', () => {
        dépôt['actionnariat'] = getTypeActionnariat({
          accessor: accessorTypeActionnariat,
          nomChampFinancementCollectif: 'financementCollectif',
          nomChampGouvernancePartagée: 'gouvernancePartagée',
        });
      })
      .with('typeGarantiesFinancières', () => {
        const raw = getTypeGarantiesFinancières(accessor, 'typeGarantiesFinancières');
        dépôt['typeGarantiesFinancières'] =
          raw === 'garantie-bancaire' ? 'avec-date-échéance' : raw;
      })
      .with('typologieInstallation', () => {
        dépôt['typologieInstallation'] = getTypologieInstallation(champs);
      })
      .with('attestationConstitutionGf', () => {
        dépôt['attestationConstitutionGf'] = undefined;
      })
      .exhaustive();
  }

  return erreurs.length
    ? { valide: false, erreurs }
    : { valide: true, dépôt: dépôt as Candidature.Dépôt.RawType };
};
