import assert from 'node:assert';

import { Then as Alors } from '@cucumber/cucumber';
import { expect } from 'chai';
import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import type { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { waitForExpect } from '#helpers';
import type { PotentielWorld } from '../../potentiel.world.js';
import type { TypeTâchePlanifiée } from '../tâchePlanifiée.world.js';

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
      assert(actualTâche, "La tâche planifiée n'a pas été trouvée pour le projet lauréat");
      expect(actualTâche.àExécuterLe.date).to.be.greaterThan(
        new Date(),
        'La date de la tâche planifiée est antérieure à la date actuelle',
      );
    });
  },
);

Alors(
  `il n'y a pas de tâche {string} planifiée pour le projet lauréat`,
  async function (this: PotentielWorld, typeTâche: TypeTâchePlanifiée) {
    const actualTypeTâche = this.tâchePlanifiéeWorld.rechercherTypeTâchePlanifiée(typeTâche).type;
    const { identifiantProjet } = this.lauréatWorld;

    await waitForExpect(async () => {
      const actualTâche = await récupérerTâchePlanifiée(actualTypeTâche, identifiantProjet);
      expect(actualTâche).to.be.undefined;
    });
  },
);
