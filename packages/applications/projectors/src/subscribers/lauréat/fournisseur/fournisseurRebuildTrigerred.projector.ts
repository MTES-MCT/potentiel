import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';
import { Where } from '@potentiel-domain/entity';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';

export const fournisseurRebuilTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await removeProjection<Lauréat.Fournisseur.FournisseurEntity>(`fournisseur|${id}`);

  const demandeChangementFournisseur =
    await listProjection<Lauréat.Fournisseur.ChangementFournisseurEntity>(
      `changement-fournisseur`,
      {
        where: { identifiantProjet: Where.equal(id) },
      },
    );

  for (const changement of demandeChangementFournisseur.items) {
    await removeProjection<Lauréat.Fournisseur.ChangementFournisseurEntity>(
      `changement-fournisseur|${id}#${changement.changement.enregistréLe}`,
    );
  }
};
