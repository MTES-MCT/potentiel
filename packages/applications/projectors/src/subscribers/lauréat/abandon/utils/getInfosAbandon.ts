import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Abandon } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';

export const getInfosAbandon = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const abandon = await findProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`);

  // virer default
  const abandonDefaultValue: Omit<Abandon.AbandonEntity, 'type'> = {
    identifiantProjet,
    demande: {
      demandéLe: '',
      demandéPar: '',
      raison: '',
      estUneRecandidature: false,
    },
    statut: 'demandé',
    misÀJourLe: DateTime.now().formatter(),
  };

  const abandonToUpsert: Omit<Abandon.AbandonEntity, 'type'> = Option.isSome(abandon)
    ? abandon
    : abandonDefaultValue;

  return abandonToUpsert;
};
