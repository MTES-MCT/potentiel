import {
  GetDossierQuery,
  getChampValue,
  getDSApiClient,
  getDecimalValue,
  getStringValue,
} from './graphql';

export type Dossier = Awaited<ReturnType<typeof getDossier>>;

export const getDossier = async (dossierNumber: number) => {
  const sdk = getDSApiClient();
  const { dossier } = await sdk.GetDossier({ dossier: dossierNumber });

  return mapApiResponseToReadModel(dossier);
};

const mapApiResponseToReadModel = ({ champs, annotations, usager }: GetDossierQuery['dossier']) => {
  const { streetAddress, departmentName, regionName, cityName, postalCode } =
    getChampValue(champs, 'Adresse', 'AddressChamp')?.address ?? {};

  const fileUrl = getChampValue(champs, 'Garanties financières', 'PieceJustificativeChamp')
    ?.files?.[0]?.url;

  return {
    nomProjet: getStringValue(champs, 'Nom du projet'),
    localité: {
      adresse1: streetAddress,
      département: departmentName,
      région: regionName,
      commune: cityName,
      codePostal: postalCode,
    },
    puissance: getDecimalValue(champs, 'Puissance'),
    prix: getDecimalValue(champs, 'Prix'),
    evaluationCarbone: getDecimalValue(champs, 'Evaluation carbonne'),
    typeGarantiesFinancières: getStringValue(champs, 'Type de garanties financières'),
    dateÉchéanceGf: getChampValue(champs, "Date d'échéance des garanties financières", 'DateChamp')
      ?.date,
    pièceJustificativeGf: fileUrl,

    // Instruction
    note: getDecimalValue(annotations, 'Note'),
    statut: getStringValue(annotations, 'Statut'),
    // numéro CRE should be a number, but the graphql API returns a string
    numéroCRE: +getChampValue(annotations, 'Numéro CRE', 'IntegerNumberChamp')?.integerNumber,

    email: usager.email,
  };
};
