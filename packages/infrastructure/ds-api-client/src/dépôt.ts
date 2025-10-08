import { Candidature } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';

import { GetDossierQuery, createDossierAccessor } from './graphql';
import {
  getTypeGarantiesFinancières,
  getHistoriqueAbandon,
  getLocalité,
  getAutorisationDUrbanisme,
  getTypeNatureDeLExploitation,
  getDateConstitutionGarantiesFinancières,
  getDispositifDeStockage,
} from './specialFields';
import { DeepPartial } from './utils';
import { getTypologieInstallation } from './getTypologieInstallation';

const colonnes = {
  nomCandidat: 'Nom du candidat',
  sociétéMère: `Nom de la société mère finale`,
  nomReprésentantLégal: `NOM et Prénom du représentant légal`,
  emailContact: 'Adresse électronique du contact',
  nomProjet: 'Nom du projet',
  puissanceProductionAnnuelle: 'Puissance installée P',
  puissanceDeSite: 'Puissance P+Q',
  prixReference: 'Prix unitaire de référence',
  evaluationCarboneSimplifiée: 'Évaluation carbone simplifiée',

  typeGarantiesFinancières: 'Type de garantie financière',

  localité: 'Adresse postale du site de production',
  historiqueAbandon: 'Préciser le statut du projet',

  obligationDeSolarisation: `Projet réalisé dans le cadre d'une obligation de solarisation`,

  installateur: "Identité de l'installateur",
  natureDeLExploitation: "Nature de l'exploitation",
  coefficientKChoisi: "Souhaitez vous bénéficier de l'indexation K ?",
} satisfies Partial<Record<keyof Candidature.Dépôt.RawType, string>>;

type MapApiResponseToDépôt = {
  champs: GetDossierQuery['dossier']['champs'];
  champDescriptors: GetDossierQuery['dossier']['demarche']['revision']['champDescriptors'];
};

export const mapApiResponseToDépôt = ({
  champs,
  champDescriptors,
}: MapApiResponseToDépôt): DeepPartial<Candidature.Dépôt.RawType> => {
  const accessor = createDossierAccessor(champs, colonnes, champDescriptors);
  const accessorAutorisationDUrbanisme = createDossierAccessor(
    champs,
    {
      numéro: "Numéro de l'autorisation d'urbanisme",
      date: "Date d'obtention de l'autorisation d'urbanisme",
    } satisfies Record<keyof Candidature.Dépôt.RawType['autorisationDUrbanisme'], string>,
    champDescriptors,
  );

  const accessorDispositifDeStockage = createDossierAccessor(
    champs,
    {
      installationAvecDispositifDeStockage: 'Installation couplée à un dispositif de stockage',
      capacitéDuDispositifDeStockageEnKWh: 'Capacité du dispositif de stockage',
      puissanceDuDispositifDeStockageEnKW: 'Puissance du dispositif de stockage',
    } satisfies Record<keyof Candidature.Dépôt.RawType['dispositifDeStockage'], string>,
    demarche.revision.champDescriptors,
  );

  const typeGarantiesFinancieres = getTypeGarantiesFinancières(
    accessor,
    'typeGarantiesFinancières',
  );

  const dateConstitutionGarantiesFinancieres = getDateConstitutionGarantiesFinancières(
    typeGarantiesFinancieres,
    champs,
    champDescriptors,
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
    puissanceProductionAnnuelle: accessor.getNumberValue('puissanceProductionAnnuelle'),
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
    natureDeLExploitation: getTypeNatureDeLExploitation(accessor, 'natureDeLExploitation'),

    autorisationDUrbanisme: getAutorisationDUrbanisme({
      accessor: accessorAutorisationDUrbanisme,
      nomChampNuméro: 'numéro',
      nomChampDate: 'date',
    }),

    typologieInstallation: getTypologieInstallation(champs),

    // Non disponibles sur Démarches simplifiées
    actionnariat: undefined,
    fournisseurs: [],
    puissanceALaPointe: undefined,
    territoireProjet: undefined,
    technologie: 'N/A',
  };
};
