import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { expect } from 'chai';

import { ListerTâchesPlanifiéesQuery } from '@potentiel-domain/tache-planifiee';

import { PotentielWorld } from '../../potentiel.world';
import { RechercherTypeTâchePlanifiée } from '../tâchePlanifiée.world';

Alors(
  `une tâche {string} est planifiée à la date du {string} pour le projet {string}`,
  async function (
    this: PotentielWorld,
    typeTâche: RechercherTypeTâchePlanifiée,
    dateTâche: string,
    nomProjet: string,
  ) {
    const actualTypeTâche = this.tâchePlanifiéeWorld.rechercherTypeTâchePlanifiée(typeTâche);
    const projet = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const tâches = await mediator.send<ListerTâchesPlanifiéesQuery>({
        type: 'Tâche.Query.ListerTâchesPlanifiées',
        data: {
          àExécuterLe: new Date(dateTâche).toISOString(),
        },
      });
      const tâche = tâches.items.find(
        (t) =>
          t.typeTâchePlanifiée.estÉgaleÀ(actualTypeTâche) &&
          t.identifiantProjet.estÉgaleÀ(projet.identifiantProjet),
      );
      expect(tâche).not.to.be.undefined;
    });
  },
);

Alors(
  `une tâche {string} n'est plus planifiée pour le projet {string}`,
  async function (
    this: PotentielWorld,
    typeTâche: RechercherTypeTâchePlanifiée,
    dateTâche: string,
    nomProjet: string,
  ) {
    const actualTypeTâche = this.tâchePlanifiéeWorld.rechercherTypeTâchePlanifiée(typeTâche);
    const projet = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const tâches = await mediator.send<ListerTâchesPlanifiéesQuery>({
        type: 'Tâche.Query.ListerTâchesPlanifiées',
        data: {
          àExécuterLe: new Date(dateTâche).toISOString(),
        },
      });
      const tâche = tâches.items.find(
        (t) =>
          t.typeTâchePlanifiée.estÉgaleÀ(actualTypeTâche) &&
          t.identifiantProjet.estÉgaleÀ(projet.identifiantProjet),
      );
      expect(tâche).to.be.undefined;
    });
  },
);
