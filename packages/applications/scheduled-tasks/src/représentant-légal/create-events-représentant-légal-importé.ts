import { writeFile } from 'fs/promises';

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

  type Statistics = {
    current: number;
    total: number;
    imported: Array<string>;
    failed: Array<{
      identifiantProjet: string;
      error: string;
    }>;
  };
  const statistics: Statistics = {
    current: 0,
    total: lauréats.items.length,
    imported: [],
    failed: [],
  };

  for (const { identifiantProjet, notifiéLe } of lauréats.items) {
    try {
      console.info(`🔍 Processing ${statistics.current++}/${statistics.total}`);
      await mediator.send<ReprésentantLégal.ReprésentantLégalUseCase>({
        type: 'Lauréat.ReprésentantLégal.UseCase.ImporterReprésentantLégal',
        data: {
          identifiantProjetValue: identifiantProjet,
          importéLe: notifiéLe,
        },
      });
      statistics.imported.push(identifiantProjet);
    } catch (error) {
      statistics.failed.push({
        identifiantProjet,
        error: (error as Error).message,
      });
    }
  }

  if (statistics.failed.length > 0) {
    const failedJson = JSON.stringify(statistics.failed, null, 2);
    await writeFile(`import-représentant-légal-failed.json`, failedJson);
    console.info('🚨 Some failed, see ./logs/import-représentant-légal-failed.json');
  }

  console.info('✨ Done');

  process.exit(0);
})();
