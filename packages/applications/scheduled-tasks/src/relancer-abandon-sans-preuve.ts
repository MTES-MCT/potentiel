import { mediator } from 'mediateur';
import {
  Abandon,
  registerLauréatQueries,
  registerLauréatUseCases,
} from '@potentiel-domain/laureat';
import { DateTime } from '@potentiel-domain/common';
import {
  findProjection,
  listProjection,
  listProjectionV2,
} from '@potentiel-infrastructure/pg-projections';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import { getLogger } from '@potentiel-libraries/monitoring';
import {
  consulterCahierDesChargesChoisiAdapter,
  listerAbandonsAdapter,
  listerAbandonsPourPorteurAdapter,
  récupérerRégionDrealAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import {
  getModèleRéponseAbandon,
  getModèleMiseEnDemeureGarantiesFinancières,
} from '@potentiel-infrastructure/document-builder';

registerLauréatQueries({
  find: findProjection,
  list: listProjection,
  listV2: listProjectionV2,
  consulterCahierDesChargesAdapter: consulterCahierDesChargesChoisiAdapter,
  listerAbandonsPourPorteur: listerAbandonsPourPorteurAdapter,
  buildModèleRéponseAbandon: getModèleRéponseAbandon,
  listerAbandons: listerAbandonsAdapter,
  récupérerRégionDreal: récupérerRégionDrealAdapter,
  buildModèleMiseEnDemeureGarantiesFinancières: getModèleMiseEnDemeureGarantiesFinancières,
});

registerLauréatUseCases({
  loadAggregate,
});

(async () => {
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
    } catch (e) {
      getLogger().error(e as Error);
    }
  }
})();
