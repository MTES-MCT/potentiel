import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import {
  ExécuterTâchePlanifiéeUseCase,
  ListerTâchesPlanifiéesQuery,
} from '@potentiel-domain/tache-planifiee';

import { PotentielWorld } from '../../potentiel.world';
import { TypeTâchePlanifiée } from '../tâchePlanifiée.world';

Quand(
  'on exécute les tâches planifiées à la date du {string}',
  async function (this: PotentielWorld, àExécuterLe: string) {
    const tâches = await mediator.send<ListerTâchesPlanifiéesQuery>({
      type: 'Tâche.Query.ListerTâchesPlanifiées',
      data: {
        àExécuterLe: new Date(àExécuterLe).toISOString(),
      },
    });
    try {
      for (const tâche of tâches.items) {
        await mediator.send<ExécuterTâchePlanifiéeUseCase>({
          type: 'System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée',
          data: {
            identifiantProjetValue: tâche.identifiantProjet.formatter(),
            typeTâchePlanifiéeValue: tâche.typeTâchePlanifiée,
          },
        });
      }
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'on exécute la tâche planifiée {string} pour le projet {string}',
  async function (this: PotentielWorld, typeTâche: TypeTâchePlanifiée, nomProjet: string) {
    try {
      const projet = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
      const actualTypeTâche = this.tâchePlanifiéeWorld.rechercherTypeTâchePlanifiée(typeTâche);

      await mediator.send<ExécuterTâchePlanifiéeUseCase>({
        type: 'System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée',
        data: {
          identifiantProjetValue: projet.identifiantProjet.formatter(),
          typeTâchePlanifiéeValue: actualTypeTâche.type,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
