import { When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import { publish } from '@potentiel/pg-event-sourcing';
import {
  GestionnaireNonRéférencéError,
  GestionnaireRéseauAjoutéEvent,
  consulterGestionnaireRéseauQueryHandlerFactory,
  consulterProjetQueryHandlerFactory,
  createGestionnaireRéseauAggregateId,
  modifierGestionnaireRéseauProjetCommandHandlerFactory,
  modifierGestionnaireRéseauProjetUseCaseFactory,
} from '@potentiel/domain';
import { findProjection } from '@potentiel/pg-projections';
import { expect } from 'chai';

Quand(
  `le porteur modifie le gestionnaire de réseau de son projet avec un gestionnaire ayant le code EIC {string}`,
  async function (this: PotentielWorld, codeEIC: string) {
    const event: GestionnaireRéseauAjoutéEvent = {
      type: 'GestionnaireRéseauAjouté',
      payload: {
        codeEIC,
        raisonSociale: 'uneRaisonSociale',
        aideSaisieRéférenceDossierRaccordement: {
          format: '',
          légende: '',
        },
      },
    };
    await publish(createGestionnaireRéseauAggregateId(codeEIC), event);

    const modifierGestionnaireRéseauProjet = getUseCase();

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

Quand(
  `le porteur modifie le gestionnaire de réseau du projet avec un gestionnaire non référencé`,
  async function (this: PotentielWorld) {
    const modifierGestionnaireRéseauProjet = getUseCase();

    try {
      await modifierGestionnaireRéseauProjet({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        identifiantGestionnaireRéseau: 'GESTIONNAIRE-INCONNU',
      });
    } catch (error) {
      if (error instanceof GestionnaireNonRéférencéError) {
        this.error = error;
      }
    }
  },
);

function getUseCase() {
  const consulterGestionnaireRéseauQuery = consulterGestionnaireRéseauQueryHandlerFactory({
    find: findProjection,
  });

  const modifierGestionnaireRéseauProjetCommand =
    modifierGestionnaireRéseauProjetCommandHandlerFactory({
      publish,
    });

  return modifierGestionnaireRéseauProjetUseCaseFactory({
    consulterGestionnaireRéseauQuery,
    modifierGestionnaireRéseauProjetCommand,
  });
}
