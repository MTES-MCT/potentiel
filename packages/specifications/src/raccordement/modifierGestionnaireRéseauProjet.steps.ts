import { When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import {
  consulterProjetQueryHandlerFactory,
  modifierGestionnaireRéseauProjetCommandHandlerFactory,
} from '@potentiel/domain';
import { findProjection } from '@potentiel/pg-projections';
import { expect } from 'chai';
Quand(
  `le porteur modifie le gestionnaire de réseau de son projet avec un gestionnaire ayant le code EIC {string}`,
  async function (this: PotentielWorld, codeEIC: string) {
    const modifierGestionnaireRéseauProjet = modifierGestionnaireRéseauProjetCommandHandlerFactory({
      loadAggregate,
      publish,
    });

    await modifierGestionnaireRéseauProjet({
      identifiantProjet: this.raccordementWorld.identifiantProjet,
      identifiantGestionnaireRéseau: codeEIC,
    });
  },
);

Alors(
  `le gestionaire de réseau {string} devrait être consultable dans le projet`,
  async function (this: PotentielWorld, codeEIC: string) {
    const consulterProjet = consulterProjetQueryHandlerFactory({
      find: findProjection,
    });

    const résultat = await consulterProjet({
      identifiantProjet: this.raccordementWorld.identifiantProjet,
    });

    expect(résultat.identifiantGestionnaire).to.deep.equal({
      codeEIC,
    });
  },
);
