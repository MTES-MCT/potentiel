import { Where } from '@potentiel-domain/entity';
import type { Lauréat } from '@potentiel-domain/projet';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const producteurRebuilTriggeredProjector = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<Lauréat.Producteur.ProducteurEntity>(`producteur|${id}`);

  const demandesChangementProducteur =
    await listProjection<Lauréat.Producteur.ChangementProducteurEntity>(`changement-producteur`, {
      where: { identifiantProjet: Where.equal(id) },
    });

  for (const changement of demandesChangementProducteur.items) {
    await removeProjection<Lauréat.Producteur.ChangementProducteurEntity>(
      `changement-producteur|${id}#${changement.changement.enregistréLe}`,
    );
  }
};
