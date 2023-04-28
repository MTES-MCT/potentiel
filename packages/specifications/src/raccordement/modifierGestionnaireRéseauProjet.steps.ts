import { When as Quand } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import { modifierGestionnaireRéseauProjetCommandHandlerFactory } from '@potentiel/domain';

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
