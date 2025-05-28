import { IdentifiantProjet } from '@potentiel-domain/common';
import { AbandonBen } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';

export const getInfosAbandon = async (
  identifiantProjet: IdentifiantProjet.RawType,
): Promise<Omit<AbandonBen.AbandonEntity, 'type'> | void> => {
  const abandon = await findProjection<AbandonBen.AbandonEntity>(`abandon|${identifiantProjet}`);

  return Option.isSome(abandon) ? abandon : undefined;
};
