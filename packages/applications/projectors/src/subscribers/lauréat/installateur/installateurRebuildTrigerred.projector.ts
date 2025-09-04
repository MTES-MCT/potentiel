import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';

export const installateurRebuilTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await removeProjection<Lauréat.Installateur.InstallateurEntity>(`installateur|${id}`);

  // TODO: ne pas oublier de supprimer les projections associées aux changements d'installateur
};
