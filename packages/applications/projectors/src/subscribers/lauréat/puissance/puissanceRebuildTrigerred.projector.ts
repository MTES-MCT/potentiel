import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Puissance } from '@potentiel-domain/laureat';

export const puissanceRebuilTriggeredProjector = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<Puissance.PuissanceEntity>(`puissance|${id}`);
};
