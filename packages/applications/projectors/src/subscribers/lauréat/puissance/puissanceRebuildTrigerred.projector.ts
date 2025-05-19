import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Where } from '@potentiel-domain/entity';

export const puissanceRebuilTriggeredProjector = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<Lauréat.Puissance.PuissanceEntity>(`puissance|${id}`);

  const demandeChangementPuissance =
    await listProjection<Lauréat.Puissance.ChangementPuissanceEntity>(`changement-puissance`, {
      where: { identifiantProjet: Where.equal(id) },
    });

  for (const changement of demandeChangementPuissance.items) {
    await removeProjection<Lauréat.Puissance.ChangementPuissanceEntity>(
      `changement-puissance|${id}#${changement.demande.demandéeLe}`,
    );
  }
};
