import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { expect } from 'chai';
import { match } from 'ts-pattern';

import { ListerTâchesPlanifiéesQuery } from '@potentiel-domain/tache-planifiee';
import { DateTime } from '@potentiel-domain/common';

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
    const actualTypeTâche = this.tâchePlanifiéeWorld.rechercherTypeTâchePlanifiée(typeTâche).type;
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
          t.typeTâchePlanifiée === actualTypeTâche &&
          t.identifiantProjet.estÉgaleÀ(projet.identifiantProjet),
      );
      expect(tâche).not.to.be.undefined;
    });
  },
);

Alors(
  `une tâche {string} est planifiée pour le projet {string}`,
  async function (
    this: PotentielWorld,
    typeTâche: RechercherTypeTâchePlanifiée,
    nomProjet: string,
  ) {
    const actualTypeTâche = this.tâchePlanifiéeWorld.rechercherTypeTâchePlanifiée(typeTâche).type;
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    const dateDemande = match(typeTâche)
      .with('changement de représentant légal réputé accordé', () =>
        DateTime.convertirEnValueType(
          this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld
            .demanderChangementReprésentantLégalFixture.demandéLe,
        )
          .ajouterNombreDeMois(3)
          .formatter(),
      )
      .otherwise(() => DateTime.now().formatter());

    await waitForExpect(async () => {
      const tâches = await mediator.send<ListerTâchesPlanifiéesQuery>({
        type: 'Tâche.Query.ListerTâchesPlanifiées',
        data: {
          àExécuterLe: dateDemande,
        },
      });

      console.log('tâches', tâches.items);

      const tâche = tâches.items.find(
        (t) =>
          t.typeTâchePlanifiée === actualTypeTâche &&
          t.identifiantProjet.estÉgaleÀ(identifiantProjet),
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
    nomProjet: string,
  ) {
    const actualTypeTâche = this.tâchePlanifiéeWorld.rechercherTypeTâchePlanifiée(typeTâche).type;
    const projet = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const tâches = await mediator.send<ListerTâchesPlanifiéesQuery>({
        type: 'Tâche.Query.ListerTâchesPlanifiées',
        data: {},
      });

      const tâche = tâches.items.find(
        (t) =>
          t.typeTâchePlanifiée === actualTypeTâche &&
          t.identifiantProjet.estÉgaleÀ(projet.identifiantProjet),
      );
      expect(tâche).to.be.undefined;
    });
  },
);
