import assert from 'assert';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';
import { Where } from '@potentiel-domain/entity';

export const dateMiseEnServiceModifiéeProjector = async ({
  type,
  payload,
}: (
  | Lauréat.Raccordement.DateMiseEnServiceModifiéeEventV1
  | Lauréat.Raccordement.DateMiseEnServiceModifiéeEvent
) &
  Event) => {
  const raccordementActuel = await findProjection<Lauréat.Raccordement.RaccordementEntity>(
    `raccordement|${payload.identifiantProjet}`,
  );

  assert(Option.isSome(raccordementActuel));

  const miseÀJourLe =
    type === 'DateMiseEnServiceModifiée-V1' ? DateTime.now().formatter() : payload.modifiéeLe;

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

  const dateMiseEnServiceTransmise = DateTime.convertirEnValueType(payload.dateMiseEnService);
  const dateMiseEnServicePlusTardiveDesAutresDossiers = DateTime.convertirEnValueType(
    autresDossiersEnService.items[0].miseEnService!.dateMiseEnService,
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
