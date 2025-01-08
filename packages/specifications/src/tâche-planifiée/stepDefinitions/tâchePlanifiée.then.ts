import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { expect } from 'chai';

import { ListerTâchesPlanifiéesQuery } from '@potentiel-domain/tache-planifiee';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { PotentielWorld } from '../../potentiel.world';
import { RechercherTypeTâchePlanifiée } from '../tâchePlanifiée.world';

async function recupérerTâche(
  typeTâche: string,
  identifiantProjet: IdentifiantProjet.ValueType,
  dateTâche?: DateTime.RawType,
) {
  const tâches = await mediator.send<ListerTâchesPlanifiéesQuery>({
    type: 'Tâche.Query.ListerTâchesPlanifiées',
    data: {
      àExécuterLe: dateTâche,
    },
  });

  const tâche = tâches.items.find(
    (t) => t.typeTâchePlanifiée === typeTâche && t.identifiantProjet.estÉgaleÀ(identifiantProjet),
  );

  return tâche;
}

Alors(
  `une tâche {string} est planifiée à la date du {string} pour le projet {string}`,
  async function (
    this: PotentielWorld,
    typeTâche: RechercherTypeTâchePlanifiée,
    dateTâche: string,
    nomProjet: string,
  ) {
    await waitForExpect(async () => {
      const actualTypeTâche = this.tâchePlanifiéeWorld.rechercherTypeTâchePlanifiée(typeTâche).type;
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      const actualTâche = await recupérerTâche(
        actualTypeTâche,
        identifiantProjet,
        DateTime.convertirEnValueType(new Date(dateTâche)).formatter(),
      );
      expect(actualTâche).not.to.be.undefined;
    });
  },
);

Alors(
  `une tâche {string} est planifiée {int} mois plus tard pour le projet lauréat`,
  async function (
    this: PotentielWorld,
    typeTâche: RechercherTypeTâchePlanifiée,
    nombreDeMois: number,
  ) {
    await waitForExpect(async () => {
      const actualTypeTâche = this.tâchePlanifiéeWorld.rechercherTypeTâchePlanifiée(typeTâche).type;
      const { identifiantProjet } = this.lauréatWorld;

      const actualTâche = await recupérerTâche(
        actualTypeTâche,
        identifiantProjet,
        DateTime.now().ajouterNombreDeMois(nombreDeMois).formatter(),
      );
      expect(actualTâche).not.to.be.undefined;
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
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const actualTâche = await recupérerTâche(actualTypeTâche, identifiantProjet);
      expect(actualTâche).to.be.undefined;
    });
  },
);
