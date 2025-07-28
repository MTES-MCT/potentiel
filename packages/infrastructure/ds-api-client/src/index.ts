import { Candidature } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import {
  GetDossierQuery,
  getChampValue,
  getDSApiClient,
  getDecimalValue,
  getUrlPièceJustificativeValue,
  getStringValue,
} from './graphql';
import { DeepPartial } from './utils';
import { getTypeGarantiesFinancières } from './fields';

export type Dossier = Awaited<ReturnType<typeof getDépôtCandidature>>;

export const getDépôtCandidature = async (dossierNumber: number) => {
  const sdk = getDSApiClient();
  try {
    const { dossier } = await sdk.GetDossier({ dossier: dossierNumber });

    return {
      dépôt: mapApiResponseToDépôt(dossier),
      fichiers: mapApiResponseToFichiers(dossier),
    };
  } catch (e) {
    console.log(e);

    return Option.none;
  }
};

export const getDossiersDemarche = async (démarcheNumber: number) => {
  const sdk = getDSApiClient();
  const { demarche } = await sdk.GetDemarche({ demarche: démarcheNumber });
  if (!demarche.dossiers.nodes) return [];
  return demarche.dossiers.nodes
    .filter((node) => node && node.state !== 'sans_suite')
    .map((node) => node!.number);
};

const mapApiResponseToDépôt = ({
  champs,
}: GetDossierQuery['dossier']): DeepPartial<Candidature.Dépôt.RawType> => {
  // TODO quelle adresse choisir...
  const { streetAddress, departmentName, regionName, cityName, postalCode } =
    getChampValue(champs, 'Adresse', 'AddressChamp')?.address ?? {};

  const localité = {
    adresse1: streetAddress ?? undefined,
    département: departmentName ?? undefined,
    région: regionName ?? undefined,
    commune: cityName ?? undefined,
    codePostal: postalCode ?? undefined,
  };

  return {
    //  1. Renseignements administratifs
    nomCandidat: getStringValue(champs, 'Nom du candidat'),
    sociétéMère: getStringValue(champs, `Nom de l'entité mère`),
    nomReprésentantLégal: getStringValue(champs, `NOM et Prénom du représentant légal`),
    emailContact: getStringValue(champs, 'Adresse électronique du contact'),

    //  2. Identification du projet
    nomProjet: getStringValue(champs, 'Nom du projet'),
    // Puissance du site p+q
    puissanceProductionAnnuelle: getDecimalValue(champs, 'Puissance'),

    // TODO est-ce que "2.4 Lauréat d'une période précédente" correspond au champs "1. Lauréat d'aucun AO\n2. Abandon classique\n3. Abandon avec recandidature\n4. Lauréat d'un AO" du csv?

    // historiqueAbandon:

    prixReference: getDecimalValue(champs, 'Prix'),
    evaluationCarboneSimplifiée: getDecimalValue(champs, 'Prix unitaire de référence (en €/MWh)'),

    // TODO autorisation d'urbanisme
    // TODO obligationDeSolarisation:
    // TODO typeInstallationsAgrivoltaiques:
    // TODO typologieDeBâtiment:
    typeGarantiesFinancières: getTypeGarantiesFinancières(champs),
    dateÉchéanceGf: getChampValue(champs, "Date d'échéance des garanties financières", 'DateChamp')
      ?.date,

    localité,
  };
};

const mapApiResponseToFichiers = ({ champs }: GetDossierQuery['dossier']) => ({
  garantiesFinancièresUrl: getUrlPièceJustificativeValue(champs, 'Garanties financières'),
});
