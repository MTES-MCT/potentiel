import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { expect } from 'chai';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../potentiel.world';
import { TypeTâchePlanifiée } from '../tâchePlanifiée.world';

export async function récupérerTâchePlanifiée(
  typeTâche: string,
  identifiantProjet: IdentifiantProjet.ValueType,
  dateTâche?: DateTime.RawType,
) {
  const tâches = await mediator.send<Lauréat.TâchePlanifiée.ListerTâchesPlanifiéesQuery>({
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
  `une tâche {string} est planifiée à la date du {string} pour le projet lauréat`,
  async function (this: PotentielWorld, typeTâche: TypeTâchePlanifiée, dateTâche: string) {
    await waitForExpect(async () => {
      const actualTypeTâche = this.tâchePlanifiéeWorld.rechercherTypeTâchePlanifiée(typeTâche).type;

      const { identifiantProjet } = this.lauréatWorld;

      const actualTâche = await récupérerTâchePlanifiée(
        actualTypeTâche,
        identifiantProjet,
        DateTime.convertirEnValueType(new Date(dateTâche)).formatter(),
      );
      expect(actualTâche).not.to.be.undefined;
    });
  },
);

Alors(
  `une tâche {string} est planifiée pour le projet lauréat`,
  async function (this: PotentielWorld, typeTâche: TypeTâchePlanifiée) {
    await waitForExpect(async () => {
      const actualTypeTâche = this.tâchePlanifiéeWorld.rechercherTypeTâchePlanifiée(typeTâche).type;

      const { identifiantProjet } = this.lauréatWorld;

      const actualTâche = await récupérerTâchePlanifiée(actualTypeTâche, identifiantProjet);
      expect(actualTâche).not.to.be.undefined;
    });
  },
);

Alors(
  `une tâche {string} n'est plus planifiée pour le projet lauréat`,
  async function (this: PotentielWorld, typeTâche: TypeTâchePlanifiée) {
    const actualTypeTâche = this.tâchePlanifiéeWorld.rechercherTypeTâchePlanifiée(typeTâche).type;
    const { identifiantProjet } = this.lauréatWorld;

    await waitForExpect(async () => {
      const actualTâche = await récupérerTâchePlanifiée(actualTypeTâche, identifiantProjet);
      expect(actualTâche).to.be.undefined;
    });
  },
);
