import { When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import {
  GestionnaireNonRéférencéError,
  buildConsulterProjetUseCase,
  buildModifierGestionnaireRéseauProjetUseCase,
} from '@potentiel/domain';
import { expect } from 'chai';
import { mediator } from 'mediateur';

Quand(
  `le porteur modifie le gestionnaire de réseau de son projet avec un gestionnaire ayant le code EIC {string}`,
  async function (this: PotentielWorld, codeEIC: string) {
    await this.gestionnaireRéseauWorld.createGestionnaireRéseau(codeEIC, 'uneRaisonSociale');

    await mediator.send(
      buildModifierGestionnaireRéseauProjetUseCase({
        identifiantProjet: this.projetWorld.identifiantProjet,
        identifiantGestionnaireRéseau: { codeEIC },
      }),
    );
  },
);

Alors(
  `le gestionaire de réseau {string} devrait être consultable dans le projet`,
  async function (this: PotentielWorld, codeEIC: string) {
    const résultat = await mediator.send(
      buildConsulterProjetUseCase({
        identifiantProjet: this.projetWorld.identifiantProjet,
      }),
    );

    expect(résultat.identifiantGestionnaire).to.deep.equal({
      codeEIC,
    });
  },
);

Quand(
  `le porteur modifie le gestionnaire de réseau du projet avec un gestionnaire non référencé`,
  async function (this: PotentielWorld) {
    try {
      await mediator.send(
        buildModifierGestionnaireRéseauProjetUseCase({
          identifiantProjet: this.projetWorld.identifiantProjet,
          identifiantGestionnaireRéseau: {
            codeEIC: 'GESTIONNAIRE-INCONNU',
          },
        }),
      );
    } catch (error) {
      if (error instanceof GestionnaireNonRéférencéError) {
        this.error = error;
      }
    }
  },
);
