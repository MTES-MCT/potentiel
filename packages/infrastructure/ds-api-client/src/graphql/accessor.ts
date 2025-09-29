import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import {
  AddressFragmentFragment,
  ChampDescriptor,
  ChampFragmentFragment,
  GetDossierQuery,
} from './client';

export type Champs = GetDossierQuery['dossier']['champs'];

export type DossierAccessor<
  TColonnes extends Record<string, string> = Record<string, string>,
  TKey extends keyof TColonnes = keyof TColonnes,
> = {
  getStringValue: (nom: TKey) => string | undefined;
  getNumberValue: (nom: TKey) => number | undefined;
  getDateValue: (nom: TKey) => Iso8601DateTime | undefined;
  getBooleanValue: (nom: TKey) => boolean | undefined;
  getUrlPièceJustificativeValue: (nom: TKey) => { url: string; contentType: string } | undefined;
  getAdresse: (nom: TKey) => AddressFragmentFragment | undefined;
};

/**
 * @param champs un array représentant les champs du dossier
 * @param colonnesMap une map entre le nom "technique" et le label du champ utilisé dans la démarche
 * @param descriptors la liste des champs de la démarche
 */
export const createDossierAccessor = <
  TColonnes extends Record<string, string>,
  TKey extends keyof TColonnes = keyof TColonnes,
>(
  champs: Champs,
  colonnesMap: TColonnes,
  descriptors: Pick<ChampDescriptor, 'label' | 'required'>[],
): DossierAccessor<TColonnes, TKey> => {
  const getChampValue = <TType extends ChampFragmentFragment['__typename']>(
    nom: TKey,
    types: TType[],
  ): (ChampFragmentFragment & { __typename: TType }) | undefined => {
    const labelDémarche = colonnesMap[nom];

    const descriptor = descriptors.find((x) => x.label === labelDémarche);
    if (!descriptor) {
      throw new FieldNotFoundError(labelDémarche);
    }

    const champ = champs.find((x) => x.label === labelDémarche);
    if (!champ) {
      // TODO comment gére la logique d'affichage conditionnelle ?
      // Actuellement, required peut être `true` pour un champ affiché conditionnellement
      // if (descriptor.required) {
      //   throw new RequiredFieldMissingError(labelDémarche);
      // }
      return;
    }
    if (!(types as string[]).includes(champ.__typename)) {
      throw new InvalidFieldTypeError(labelDémarche, types.join(','), champ.__typename);
    }

    return champ as ChampFragmentFragment & { __typename: TType };
  };

  return {
    getStringValue: (nom) => getChampValue(nom, ['TextChamp'])?.stringValue ?? undefined,

    getNumberValue: (nom) => {
      const val = getChampValue(nom, ['DecimalNumberChamp', 'IntegerNumberChamp']);
      const num =
        (val?.__typename === 'IntegerNumberChamp' ? val.integerNumber : val?.decimalNumber) ??
        undefined;

      return num ? Number(num) : undefined;
    },

    getDateValue: (nom) => {
      const date = getChampValue(nom, ['DateChamp'])?.date;

      return date ? (new Date(date).toISOString() as Iso8601DateTime) : undefined;
    },

    getBooleanValue: (nom) => {
      const val = getChampValue(nom, ['YesNoChamp', 'CheckboxChamp'])?.stringValue ?? undefined;
      return val === 'false' ? false : val === 'true' ? true : undefined;
    },

    getUrlPièceJustificativeValue: (nom) => {
      const file = getChampValue(nom, ['PieceJustificativeChamp'])?.files?.[0];
      if (!file) {
        return undefined;
      }
      return {
        url: file.url,
        contentType: file.contentType,
      };
    },

    getAdresse: (nom) => getChampValue(nom, ['AddressChamp'])?.address ?? undefined,
  };
};

class FieldNotFoundError extends Error {
  constructor(public fieldName: string) {
    super('Champ non existant dans la démarche');
  }
}

// class RequiredFieldMissingError extends Error {
//   constructor(public fieldName: string) {
//     super('Un champ requis est manquant dans le dossier');
//   }
// }

class InvalidFieldTypeError extends Error {
  constructor(
    public fieldName: string,
    public expected: string,
    public actual: string,
  ) {
    super('Type de champs non valide');
  }
}
