import { Candidature } from '@potentiel-domain/projet';

import { DossierAccessor } from '../../graphql/index.js';
import { reverseRecord } from '../reverseRecord.js';
import { mapSelectToValueType } from '../mappers/mapSelectToValueType.js';

const typeGfMap = reverseRecord({
  consignation: 'Consignation',
  'avec-date-échéance': 'Garantie bancaire',
  exemption: `Exemption`,
} satisfies Partial<Record<Candidature.TypeGarantiesFinancières.RawType, string>>);

export const getTypeGarantiesFinancières = <
  T extends Record<string, string>,
  TName extends string & keyof T,
>(
  accessor: DossierAccessor<T>,
  nom: TName,
) => mapSelectToValueType(typeGfMap, accessor, nom);
