import { Lauréat } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const achèvementRebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<Lauréat.Achèvement.AttestationConformité.AchèvementEntity>(
    `achèvement|${id}`,
  );
  await removeProjection<Lauréat.Achèvement.AchèvementEntity>(`achèvement|${id}`);
};
