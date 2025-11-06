import { RebuildAllTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjectionByCategory } from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';

export const actionnaireRebuildAllTriggered = async (_: RebuildAllTriggered) => {
  await removeProjectionByCategory<Lauréat.Actionnaire.ActionnaireEntity>(`actionnaire`);
  await removeProjectionByCategory<Lauréat.Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire`,
  );
};
