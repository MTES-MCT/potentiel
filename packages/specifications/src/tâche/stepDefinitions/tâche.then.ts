import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { ListerTâchesQuery } from '@potentiel-domain/tache';

import { PotentielWorld } from '../../potentiel.world';
import { expect } from 'chai';
import { RechercherTypeTâche } from '../tâche.world';

Alors(
  `une tâche indiquant de {string} est consultable dans la liste des tâches du porteur pour le projet`,
  async function (this: PotentielWorld, typeTâche: RechercherTypeTâche) {
    const actualTypeTâche = this.tâcheWorld.rechercherTypeTâche(typeTâche);

    await waitForExpect(async () => {
      const tâches = await mediator.send<ListerTâchesQuery>({
        type: 'Tâche.Query.ListerTâches',
        data: {
          email: this.utilisateurWorld.porteur,
        },
      });

      const tâche = tâches.items.find((t) => t.typeTâche.estÉgaleÀ(actualTypeTâche));
      expect(tâche).to.be.not.undefined;
    });
  },
);

Alors(
  `une tâche indiquant de {string} n'est plus consultable dans la liste des tâches du porteur pour le projet`,
  async function (this: PotentielWorld, typeTâche: RechercherTypeTâche) {
    const actualTypeTâche = this.tâcheWorld.rechercherTypeTâche(typeTâche);

    await waitForExpect(async () => {
      const tâches = await mediator.send<ListerTâchesQuery>({
        type: 'Tâche.Query.ListerTâches',
        data: {
          email: this.utilisateurWorld.porteur,
        },
      });

      const tâche = tâches.items.find((t) => t.typeTâche.estÉgaleÀ(actualTypeTâche));
      expect(tâche).to.be.undefined;
    });
  },
);
