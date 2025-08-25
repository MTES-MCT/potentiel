import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../potentiel.world';
import { TypeTâchePlanifiée } from '../tâchePlanifiée.world';

Quand(
  'on exécute les tâches planifiées à la date du {string}',
  async function (this: PotentielWorld, dateExécution: string) {
    const àExécuterLe = new Date(dateExécution);
    const tâches = await mediator.send<Lauréat.TâchePlanifiée.ListerTâchesPlanifiéesQuery>({
      type: 'Tâche.Query.ListerTâchesPlanifiées',
      data: {
        àExécuterLe: àExécuterLe.toISOString(),
      },
    });
    try {
      for (const tâche of tâches.items) {
        await exécuterTâchePlanifiée.call(
          this,
          tâche.identifiantProjet,
          tâche.typeTâchePlanifiée,
          àExécuterLe,
        );
      }
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'on exécute la tâche planifiée {string} pour le projet lauréat',
  async function (this: PotentielWorld, typeTâche: TypeTâchePlanifiée) {
    try {
      const { identifiantProjet } = this.lauréatWorld;
      const actualTypeTâche = this.tâchePlanifiéeWorld.rechercherTypeTâchePlanifiée(typeTâche);
      await exécuterTâchePlanifiée.call(this, identifiantProjet, actualTypeTâche.type, new Date());
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'on exécute la tâche planifiée {string} pour le projet lauréat à la date du {string}',
  async function (this: PotentielWorld, typeTâche: TypeTâchePlanifiée, exécutéLe: string) {
    try {
      const { identifiantProjet } = this.lauréatWorld;
      const actualTypeTâche = this.tâchePlanifiéeWorld.rechercherTypeTâchePlanifiée(typeTâche);
      await exécuterTâchePlanifiée.call(
        this,
        identifiantProjet,
        actualTypeTâche.type,
        new Date(exécutéLe),
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

async function exécuterTâchePlanifiée(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  typeTâche: string,
  exécutéeLe: Date,
) {
  await mediator.send<Lauréat.TâchePlanifiée.ExécuterTâchePlanifiéeUseCase>({
    type: 'System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
      typeTâchePlanifiéeValue: typeTâche,
      exécutéeLe: exécutéeLe.toISOString(),
    },
  });
}
