import { mediator } from 'mediateur';

import { listProjection } from '@potentiel-infrastructure/pg-projections';
import { Lauréat, ReprésentantLégal } from '@potentiel-domain/laureat';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';

import { verifyEnvVariables } from '../_utils/verifyEnvVariables';

verifyEnvVariables(['EVENT_STORE_CONNECTION_STRING']);

ReprésentantLégal.registerReprésentantLégalUseCases({
  loadAggregate,
});

(async () => {
  console.info('✨ Migration ReprésentantLégalImporté');

  const lauréats = await listProjection<Lauréat.LauréatEntity>('lauréat');

  await Promise.all(
    lauréats.items.map(({ identifiantProjet, notifiéLe }) =>
      mediator.send<ReprésentantLégal.ReprésentantLégalUseCase>({
        type: 'Lauréat.ReprésentantLégal.UseCase.ImporterReprésentantLégal',
        data: {
          identifiantProjetValue: identifiantProjet,
          importéLe: notifiéLe,
        },
      }),
    ),
  );

  console.info('✨ Done');

  process.exit(0);
})();
