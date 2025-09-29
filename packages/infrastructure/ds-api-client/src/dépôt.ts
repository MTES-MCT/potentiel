import { Candidature } from '@potentiel-domain/projet';

import { GetDossierQuery, createDossierAccessor } from './graphql';
import {
  getTypeGarantiesFinancières,
  getHistoriqueAbandon,
  getLocalité,
  getAutorisationDUrbanisme,
  getTypeNatureDeLExploitation,
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
  dateÉchéanceGf: "Date d'échéance des garanties financières",
  dateDélibérationGf: "Date de la délibération portant sur le projet objet de l'offre",

  localité: 'Adresse postale du site de production',
  historiqueAbandon: 'Préciser le statut du projet',

  obligationDeSolarisation: `Projet réalisé dans le cadre d'une obligation de solarisation`,
  installationAvecDispositifDeStockage: 'Installation couplée à un dispositif de stockage',
  installateur: "Identité de l'installateur",
  natureDeLExploitation: "Nature de l'exploitation",
  coefficientKChoisi: "Souhaitez vous bénéficier de l'indexation K ?",
} satisfies Partial<Record<keyof Candidature.Dépôt.RawType, string>>;

export const mapApiResponseToDépôt = ({
  champs,
  demarche,
}: GetDossierQuery['dossier']): DeepPartial<Candidature.Dépôt.RawType> => {
  const accessor = createDossierAccessor(champs, colonnes, demarche.revision.champDescriptors);
  const accessorAutorisationDUrbanisme = createDossierAccessor(
    champs,
    {
      numéro: "Numéro de l'autorisation d'urbanisme",
      date: "Date d'obtention de l'autorisation d'urbanisme",
    } satisfies Record<keyof Candidature.Dépôt.RawType['autorisationDUrbanisme'], string>,
    demarche.revision.champDescriptors,
  );

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
    puissanceDeSite: accessor.getNumberValue('puissanceDeSite'),

    prixReference: accessor.getNumberValue('prixReference'),
    evaluationCarboneSimplifiée: accessor.getNumberValue('evaluationCarboneSimplifiée'),

    typeGarantiesFinancières: typeGarantiesFinancieres,
    dateDélibérationGf:
      typeGarantiesFinancieres === 'exemption'
        ? accessor.getDateValue('dateDélibérationGf')
        : undefined,
    historiqueAbandon: getHistoriqueAbandon(accessor, 'historiqueAbandon'),

    obligationDeSolarisation: accessor.getBooleanValue('obligationDeSolarisation'),
    coefficientKChoisi: accessor.getBooleanValue('coefficientKChoisi'),

    localité: getLocalité(accessor, 'localité'),

    installationAvecDispositifDeStockage: accessor.getBooleanValue(
      'installationAvecDispositifDeStockage',
    ),
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
