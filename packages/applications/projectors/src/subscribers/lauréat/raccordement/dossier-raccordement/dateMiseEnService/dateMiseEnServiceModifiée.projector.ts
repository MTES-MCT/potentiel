import assert from 'node:assert';

import { DateTime } from '@potentiel-domain/common';
import { Where } from '@potentiel-domain/entity';
import type { Lauréat } from '@potentiel-domain/projet';
import type { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

type DateMiseEnServiceModifiéeProps = (
  | Lauréat.Raccordement.DateMiseEnServiceModifiéeEventV1
  | Lauréat.Raccordement.DateMiseEnServiceModifiéeEvent
) &
  Event;

export const dateMiseEnServiceModifiéeProjector = async ({
  type,
  payload,
  created_at,
}: DateMiseEnServiceModifiéeProps) => {
  const raccordementActuel = await findProjection<Lauréat.Raccordement.RaccordementEntity>(
    `raccordement|${payload.identifiantProjet}`,
  );

  assert(Option.isSome(raccordementActuel));

  const miseÀJourLe =
    type === 'DateMiseEnServiceModifiée-V1'
      ? DateTime.convertirEnValueType(created_at).formatter()
      : payload.modifiéeLe;

  await updateOneProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${payload.identifiantProjet}#${payload.référenceDossierRaccordement}`,
    {
      miseEnService: {
        dateMiseEnService: payload.dateMiseEnService,
      },
      miseÀJourLe,
    },
  );

  const autresDossiersEnService =
    await listProjection<Lauréat.Raccordement.DossierRaccordementEntity>(`dossier-raccordement`, {
      where: {
        identifiantProjet: Where.equal(payload.identifiantProjet),
        référence: Where.notEqual(payload.référenceDossierRaccordement),
        miseEnService: {
          dateMiseEnService: Where.notEqualNull(),
        },
      },
      orderBy: {
        miseEnService: {
          dateMiseEnService: 'descending',
        },
      },
    });

  if (autresDossiersEnService.items.length === 0) {
    await updateOneProjection<Lauréat.Raccordement.RaccordementEntity>(
      `raccordement|${payload.identifiantProjet}`,
      {
        miseEnService: {
          date: payload.dateMiseEnService,
          référenceDossierRaccordement: payload.référenceDossierRaccordement,
        },
      },
    );
    return;
  }

  if (!autresDossiersEnService.items[0].miseEnService) {
    getLogger().error(`Aucune date de mise en service actuelle n'a été trouvée`, {
      identifiantProjet: payload.identifiantProjet,
    });
    return;
  }

  const dateMiseEnServiceTransmise = DateTime.convertirEnValueType(payload.dateMiseEnService);
  const dateMiseEnServicePlusTardiveDesAutresDossiers = DateTime.convertirEnValueType(
    autresDossiersEnService.items[0].miseEnService.dateMiseEnService,
  );

  if (dateMiseEnServiceTransmise.estAntérieurÀ(dateMiseEnServicePlusTardiveDesAutresDossiers)) {
    await updateOneProjection<Lauréat.Raccordement.RaccordementEntity>(
      `raccordement|${payload.identifiantProjet}`,
      {
        miseEnService: {
          date: dateMiseEnServicePlusTardiveDesAutresDossiers.formatter(),
          référenceDossierRaccordement: autresDossiersEnService.items[0].référence,
        },
      },
    );
  } else {
    await updateOneProjection<Lauréat.Raccordement.RaccordementEntity>(
      `raccordement|${payload.identifiantProjet}`,
      {
        miseEnService: {
          date: payload.dateMiseEnService,
          référenceDossierRaccordement: payload.référenceDossierRaccordement,
        },
      },
    );
  }
};
