import {
  TâchePlanifiéeAnnuléeEvent,
  TâchePlanifiéeEntity,
} from '@potentiel-domain/tache-planifiee';

import { removeProjection } from '../../../infrastructure';

export const tâchePlanifiéeAnnuléeProjector = async ({
  payload: { identifiantProjet, typeTâchePlanifiée },
}: TâchePlanifiéeAnnuléeEvent) => {
  await removeProjection<TâchePlanifiéeEntity>(
    `tâche-planifiée|${typeTâchePlanifiée}#${identifiantProjet}`,
  );
};
