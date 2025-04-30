import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Producteur } from '@potentiel-domain/laureat';

export const producteurRebuilTriggeredProjector = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<Producteur.ProducteurEntity>(`producteur|${id}`);
};
