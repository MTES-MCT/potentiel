import { Then as Alors } from '@cucumber/cucumber';
import { expect } from 'chai';
import { mediator } from 'mediateur';

import { mapToPlainObject } from '@potentiel-domain/core';
import type { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { waitForExpect } from '#helpers';
import type { PotentielWorld } from '../../potentiel.world.js';

Alors('le gestionnaire de réseau devrait être consultable', async function (this: PotentielWorld) {
  await waitForExpect(async () => {
    const listeGestionnaireRéseau =
      await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
        type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
        data: {},
      });

    const actualGRDFromList = listeGestionnaireRéseau.items[0];

    const consulterGestionnaireRéseauReadModel =
      await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>({
        type: 'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
        data: {
          identifiantGestionnaireRéseau: actualGRDFromList.identifiantGestionnaireRéseau.codeEIC,
        },
      });

    const actual = mapToPlainObject(consulterGestionnaireRéseauReadModel);
    const expected = mapToPlainObject(this.gestionnaireRéseauWorld.mapToExpected());

    expect(actual).to.be.deep.equal(expected);
  });
});

Alors(
  `la référence de dossier {string} devrait être {valide-invalide}`,
  async function (
    this: PotentielWorld,
    référenceÀValider: string,
    résultat: 'valide' | 'invalide',
  ) {
    const actual = this.gestionnaireRéseauWorld.résultatsValidation.get(référenceÀValider);

    if (actual === undefined) {
      throw new Error(
        `Aucun résultat de validation disponible pour la référence ${référenceÀValider}`,
      );
    }

    actual.should.equal(résultat === 'valide' ? true : false);
  },
);
