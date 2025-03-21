import { GraphQLClient } from 'graphql-request';

import { ChampFragmentFragment, GetDossierQuery, getSdk } from './client';

export type * from './client';
export type TypeChamp = GetDossierQuery['dossier']['champs'][number]['__typename'];

class FieldNotFoundError extends Error {
  constructor(public fieldName: string) {
    super('Champs not found');
  }
}

class InvalidFieldTypeError extends Error {
  constructor(
    public fieldName: string,
    public expected: string,
    public actual: string,
  ) {
    super('Type de champs non valide');
  }
}

type Champs = GetDossierQuery['dossier']['champs'];
export const getChampValue = <TType extends ChampFragmentFragment['__typename']>(
  champs: Champs,
  name: string,
  type: TType,
): (ChampFragmentFragment & { __typename: TType }) | undefined => {
  const champ = champs.find((x) => x.label === name);
  if (!champ) {
    return undefined;
    throw new FieldNotFoundError(name);
  }
  if (champ.__typename !== type) {
    throw new InvalidFieldTypeError(name, type!, champ.__typename);
  }

  return champ as ChampFragmentFragment & { __typename: TType };
};

export const getStringValue = (champs: Champs, name: string) =>
  getChampValue(champs, name, 'TextChamp')?.stringValue ?? undefined;

export const getDecimalValue = (champs: Champs, name: string) =>
  getChampValue(champs, name, 'DecimalNumberChamp')?.decimalNumber ?? undefined;

export const getDSApiClient = () => {
  const { DS_API_URL, DS_API_TOKEN } = process.env;
  if (!DS_API_URL) {
    throw new Error('DS_API_URL is required');
  }
  if (!DS_API_TOKEN) {
    throw new Error('DS_API_TOKEN is required');
  }
  const client = new GraphQLClient(DS_API_URL, {
    headers: {
      Authorization: `Bearer ${DS_API_TOKEN}`,
    },
  });
  return getSdk(client);
};
