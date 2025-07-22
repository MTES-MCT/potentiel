import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';

export const getInfosAbandon = async (
  identifiantProjet: IdentifiantProjet.RawType,
): Promise<Omit<Lauréat.Abandon.AbandonEntity, 'type'> | void> => {
  const abandon = await findProjection<Lauréat.Abandon.AbandonEntity>(
    `abandon|${identifiantProjet}`,
  );

  return Option.isSome(abandon) ? abandon : undefined;
};
