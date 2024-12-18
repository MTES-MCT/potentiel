import { Actionnaire } from '@potentiel-domain/laureat';

import { removeProjection } from '../../../infrastructure';

export const handleDemandeChangementActionnaireRejetée = async ({
  payload: { identifiantProjet },
}: Actionnaire.DemandeChangementActionnaireRejetéeEvent) => {
  await removeProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`);
};
