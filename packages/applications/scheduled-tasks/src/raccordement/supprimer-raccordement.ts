import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import {
  Raccordement,
  registerRéseauQueries,
  registerRéseauUseCases,
} from '@potentiel-domain/reseau';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { loadAggregate, publish } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  countProjection,
  findProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projections';
import { Candidature } from '@potentiel-domain/candidature';

registerRéseauUseCases({
  loadAggregate,
});

registerRéseauQueries({
  list: listProjection,
  find: findProjection,
  count: countProjection,
});

Candidature.registerCandidatureQueries({
  find: findProjection,
  list: listProjection,
  récupérerProjet: CandidatureAdapter.récupérerProjetAdapter,
  récupérerProjets: CandidatureAdapter.récupérerProjetsAdapter,
  récupérerProjetsEligiblesPreuveRecanditure:
    CandidatureAdapter.récupérerProjetsEligiblesPreuveRecanditureAdapter,
});

async () => {
  const projetsAbandonnés = await mediator.send<Candidature.ListerCandidaturesQuery>({
    type: 'Candidature.Query.ListerCandidatures',
    data: {
      statut: 'abandonné',
    },
  });

  for (const { identifiantProjet } of projetsAbandonnés.items) {
    const raccordement = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
      type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
      },
    });

    if (Option.isSome(raccordement)) {
      const event: Raccordement.RaccordementSuppriméEvent = {
        payload: {
          identifiantProjet: identifiantProjet.formatter(),
        },
        type: 'RaccordementSupprimé-V1',
      };

      await publish(`raccordement|${identifiantProjet.formatter()}`, event);
    }
  }
};
