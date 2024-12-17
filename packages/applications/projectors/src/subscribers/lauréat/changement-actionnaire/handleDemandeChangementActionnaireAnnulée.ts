import { Actionnaire } from '@potentiel-domain/laureat';

import { removeProjection } from '../../../infrastructure';

export const handleDemandeChangementActionnaireAnnulée = async ({
  payload: { identifiantProjet },
}: Actionnaire.DemandeChangementActionnaireAnnuléEvent) => {
  await removeProjection<Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}`,
  );
};
