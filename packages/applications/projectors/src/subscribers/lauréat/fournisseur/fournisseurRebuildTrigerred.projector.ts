import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';

export const fournisseurRebuilTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await removeProjection<Lauréat.Fournisseur.FournisseurEntity>(`fournisseur|${id}`);

  // const demandesChangementFournisseur =
  //   await listProjection<Lauréat.Fournisseur.ChangementFournisseurEntity>(`changement-fournisseur`, {
  //     where: { identifiantProjet: Where.equal(id) },
  //   });

  // for (const changement of demandesChangementFournisseur.items) {
  //   await removeProjection<Lauréat.Fournisseur.ChangementFournisseurEntity>(
  //     `changement-fournisseur|${id}#${changement.changement.enregistréLe}`,
  //   );
  // }
};
