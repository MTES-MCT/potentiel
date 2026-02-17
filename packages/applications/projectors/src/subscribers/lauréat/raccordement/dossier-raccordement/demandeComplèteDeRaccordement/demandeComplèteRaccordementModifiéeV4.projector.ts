import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const demandeComplèteRaccordementModifiéeV4Projector = async ({
  payload: {
    identifiantProjet,
    référenceDossierRaccordement,
    dateQualification,
    accuséRéception: { format },
    modifiéeLe,
  },
}: Lauréat.Raccordement.DemandeComplèteRaccordementModifiéeEvent) => {
  await updateOneProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
    {
      demandeComplèteRaccordement: {
        dateQualification,
        accuséRéception: {
          format,
        },
      },
      miseÀJourLe: DateTime.convertirEnValueType(modifiéeLe).formatter(),
    },
  );
};
