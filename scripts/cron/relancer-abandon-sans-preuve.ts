import { mediator } from 'mediateur';
import {
  Abandon,
  registerLauréatQueries,
  registerLauréatUseCases,
} from '@potentiel-domain/laureat';
import { DateTime } from '@potentiel-domain/common';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import { getLogger } from '@potentiel/monitoring';

registerLauréatQueries({
  find: findProjection,
  list: listProjection,
});

registerLauréatUseCases({
  loadAggregate,
});

(async () => {
  const abandonsÀRelancer =
    await mediator.send<Abandon.ListerAbandonsAvecRecandidatureÀRelancerQuery>({
      type: 'LISTER_ABANDONS_AVEC_RECANDIDATURE_À_RELANCER_QUERY',
      data: {},
    });

  for (const { identifiantProjet } of abandonsÀRelancer.résultats) {
    try {
      await mediator.send<Abandon.AbandonUseCase>({
        type: 'DEMANDER_PREUVE_RECANDIDATURE_USECASE',
        data: {
          dateDemandeValue: DateTime.now().formatter(),
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });
    } catch (e) {
      getLogger().error(e as Error);
    }
  }
})();
