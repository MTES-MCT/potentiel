import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';
import { Where } from '@potentiel-domain/entity';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';

export const producteurrebuildTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
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
