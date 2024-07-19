import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import {
  ExécuterTâchePlanifiéeUseCase,
  ListerTâchesPlanifiéesQuery,
} from '@potentiel-domain/tache-planifiee';

import { PotentielWorld } from '../../potentiel.world';

Quand(
  'on execute les tâches planifiées à la date du {string}',
  async function (this: PotentielWorld, àExécuterLe: string) {
    const tâches = await mediator.send<ListerTâchesPlanifiéesQuery>({
      type: 'Tâche.Query.ListerTâchesPlanifiées',
      data: {
        àExécuterLe: new Date(àExécuterLe).toISOString(),
      },
    });

    for (const tâche of tâches.items) {
      await mediator.send<ExécuterTâchePlanifiéeUseCase>({
        type: 'System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée',
        data: {
          identifiantProjetValue: tâche.identifiantProjet.formatter(),
          typeTâchePlanifiéeValue: tâche.typeTâchePlanifiée.type,
        },
      });
    }
  },
);
