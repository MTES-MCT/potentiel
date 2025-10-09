import { Candidature } from '@potentiel-domain/projet';

import { DossierAccessor } from '../../graphql';
import { reverseRecord } from '../reverseRecord';
import { mapSelectToValueType } from '../mappers/mapSelectToValueType';

const typeHistoriqueAbandonMap = reverseRecord({
  'abandon-classique': `Le projet avait été retenu mais a demandé l'abandon de son statut de lauréat`,
  'première-candidature': `Le projet n'avait pas été retenu`,
} satisfies Partial<Record<Candidature.HistoriqueAbandon.RawType, string>>);

export const getHistoriqueAbandon = <
  T extends Record<string, string>,
  TName extends string & keyof T,
>(
  accessor: DossierAccessor<T>,
  nom: TName,
) => mapSelectToValueType(typeHistoriqueAbandonMap, accessor, nom) ?? 'première-candidature';
