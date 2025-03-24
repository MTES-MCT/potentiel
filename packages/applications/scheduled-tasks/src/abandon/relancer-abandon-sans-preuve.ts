import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import {
  Abandon,
  registerLauréatQueries,
  registerLauréatUseCases,
} from '@potentiel-domain/laureat';
import {
  consulterCahierDesChargesChoisiAdapter,
  DocumentAdapter,
  récupérerIdentifiantsProjetParEmailPorteurAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  countProjection,
  findProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projection-read';
import { getLogger } from '@potentiel-libraries/monitoring';

registerLauréatQueries({
  find: findProjection,
  list: listProjection,
  récupérerIdentifiantsProjetParEmailPorteur: récupérerIdentifiantsProjetParEmailPorteurAdapter,
  consulterCahierDesChargesAdapter: consulterCahierDesChargesChoisiAdapter,
  count: countProjection,
});

registerLauréatUseCases({
  loadAggregate,
  supprimerDocumentProjetSensible: DocumentAdapter.remplacerDocumentProjetSensible,
});

void (async () => {
  const abandonsÀRelancer =
    await mediator.send<Abandon.ListerAbandonsAvecRecandidatureÀRelancerQuery>({
      type: 'Lauréat.Abandon.Query.ListerAbandonsAvecRecandidatureÀRelancer',
      data: {},
    });

  for (const { identifiantProjet } of abandonsÀRelancer.résultats) {
    try {
      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.DemanderPreuveRecandidatureAbandon',
        data: {
          dateDemandeValue: DateTime.now().formatter(),
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      process.exit(0);
    } catch (e) {
      getLogger().error(e as Error);
    }
  }
})();
