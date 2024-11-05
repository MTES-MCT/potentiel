import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

(async () => {
  console.info('✨ Migration ReprésentantLégalImporté');

  const candidatures = await mediator.send<Candidature.ListerCandidaturesQuery>({
    type: 'Candidature.Query.ListerCandidatures',
    data: {
      estNotifiée: true,
      statut: 'classé',
    },
  });

  await Promise.all(
    candidatures.items.map(({ identifiantProjet, nomReprésentantLégal }) =>
      mediator.send<ReprésentantLégal.UseCase.ImporterReprésentantLégal>({
        type: 'Lauréat.ReprésentantLégal.UseCase.ImporterReprésentantLégal',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          représentantLégalValue: nomReprésentantLégal,
        },
      }),
    ),
  );

  process.exit(0);
})();
