import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Actionnaire } from '@potentiel-domain/laureat';

import { removeProjection } from '../../../infrastructure';

export const handleRebuilTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<Actionnaire.ModificationActionnaireEntity>(
    `modification-actionnaire|${id}`,
  );
};
