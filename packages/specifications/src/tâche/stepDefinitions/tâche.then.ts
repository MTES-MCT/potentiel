import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { expect } from 'chai';

import { ListerTâchesQuery } from '@potentiel-domain/tache';
import { ListerTâchesPlanifiéesQuery } from '@potentiel-domain/tache';

import { PotentielWorld } from '../../potentiel.world';
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

Alors(
  `une tâche {string} est planifée à la date du {string} pour le projet {string}`,
  async function (
    this: PotentielWorld,
    typeTâche: RechercherTypeTâche,
    dateTâche: string,
    nomProjet: string,
  ) {
    const actualTypeTâche = this.tâcheWorld.rechercherTypeTâche(typeTâche);
    const projet = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const tâches = await mediator.send<ListerTâchesPlanifiéesQuery>({
        type: 'Tâche.Query.ListerTâchesPlanifiées',
        data: {
          àExecuterLe: new Date(dateTâche).toISOString(),
        },
      });
      const tâche = tâches.items.find(
        (t) =>
          t.typeTâche.estÉgaleÀ(actualTypeTâche) &&
          t.identifiantProjet.estÉgaleÀ(projet.identifiantProjet),
      );
      expect(tâche).not.to.be.undefined;
    });
  },
);
