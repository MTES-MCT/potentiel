import {
  TâchePlanifiéeExecutéeEvent,
  TâchePlanifiéeEntity,
} from '@potentiel-domain/tache-planifiee';

import { removeProjection } from '../../../infrastructure';

export const tâchePlanifiéeExecutéeProjector = async ({
  payload: { identifiantProjet, typeTâchePlanifiée },
}: TâchePlanifiéeExecutéeEvent) => {
  await removeProjection<TâchePlanifiéeEntity>(
    `tâche-planifiée|${typeTâchePlanifiée}#${identifiantProjet}`,
  );
};
