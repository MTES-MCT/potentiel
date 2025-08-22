import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';
import type { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

import { getDossierRaccordement } from '../../_utils/getDossierRaccordement';
import { upsertDossierRaccordement } from '../../_utils/upsertDossierRaccordement';

export const demandeComplèteRaccordementModifiéeV1Projector = async ({
  payload: { identifiantProjet, referenceActuelle, nouvelleReference, dateQualification },
  created_at,
}: Lauréat.Raccordement.DemandeComplèteRaccordementModifiéeEventV1 & Event) => {
  const { dossier, raccordement } = await getDossierRaccordement(
    identifiantProjet,
    referenceActuelle,
  );

  await removeProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${referenceActuelle}`,
  );

  await upsertDossierRaccordement({
    identifiantProjet,
    raccordement: {
      ...raccordement,
      dossiers: raccordement.dossiers.filter((d) => d.référence === referenceActuelle),
    },
    dossierRaccordement: {
      ...dossier,
      référence: nouvelleReference,
      demandeComplèteRaccordement: {
        ...dossier.demandeComplèteRaccordement,
        dateQualification,
      },
      misÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  });
};
