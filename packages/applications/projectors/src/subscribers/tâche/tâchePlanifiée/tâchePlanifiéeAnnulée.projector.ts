import {
  TâchePlanifiéeAnnuléeEvent,
  TâchePlanifiéeEntity,
} from '@potentiel-domain/tache-planifiee';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const tâchePlanifiéeAnnuléeProjector = async ({
  payload: { identifiantProjet, typeTâchePlanifiée },
}: TâchePlanifiéeAnnuléeEvent) => {
  await removeProjection<TâchePlanifiéeEntity>(
    `tâche-planifiée|${typeTâchePlanifiée}#${identifiantProjet}`,
  );
};
