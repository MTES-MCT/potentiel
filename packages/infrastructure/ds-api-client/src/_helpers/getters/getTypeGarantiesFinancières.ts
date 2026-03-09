import { Candidature } from '@potentiel-domain/projet';

import { DossierAccessor } from '../../graphql/index.js';
import { mapSelectToValueType } from '../mappers/mapSelectToValueType.js';

const typeGfMap = {
  Consignation: 'consignation',
  "Garantie financière avec date d'échéance et à renouveler": 'avec-date-échéance',
  'Garantie bancaire': 'avec-date-échéance',
  "Garantie financière jusqu'à 6 mois après la date d'achèvement": 'six-mois-après-achèvement',
  Exemption: 'exemption',
} satisfies Partial<Record<string, Candidature.TypeGarantiesFinancières.RawType>>;

export const getTypeGarantiesFinancières = <
  T extends Record<string, string>,
  TName extends string & keyof T,
>(
  accessor: DossierAccessor<T>,
  nom: TName,
) => mapSelectToValueType(typeGfMap, accessor, nom);
