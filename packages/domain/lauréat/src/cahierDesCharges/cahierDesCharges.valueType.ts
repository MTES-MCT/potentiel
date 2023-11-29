import { InvalidOperationError } from '@potentiel-domain/core';

const cahierDesChargesRéférences = [
  'initial',
  '30/01/2021',
  '30/08/2022',
  '30/08/2022-alternatif',
  '07/02/2023',
  '07/02/2023-alternatif',
];

export type RawType = (typeof cahierDesChargesRéférences)[number];

const datesParutionCahiersDesChargesModifiés = ['30/07/2021', '30/08/2022', '07/02/2023'] as const;

type DateParutionCahierDesChargesModifié = (typeof datesParutionCahiersDesChargesModifiés)[number];

export type ValueType =
  | { type: 'initial' }
  | {
      type: 'modifié';
      paruLe: DateParutionCahierDesChargesModifié;
      alternatif?: true;
    };

export const convertirEnValueType = (référence: string): ValueType => {
  estValide(référence);
  if (référence === 'initial') {
    return { type: 'initial' };
  }
  return {
    type: 'modifié',
    paruLe: référence.replace('-alternatif', '') as DateParutionCahierDesChargesModifié,
    alternatif: référence.search('-alternatif') === -1 ? undefined : true,
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = (cahierDesChargesRéférences as Array<string>).includes(value);

  if (!isValid) {
    throw new CahierDesChargesRéférenceInvalideError(value);
  }
}

class CahierDesChargesRéférenceInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`La référence du cahier des charges est invalide`, {
      value,
    });
  }
}
