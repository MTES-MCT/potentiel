import { When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import {
  DomainUseCase,
  convertirEnIdentifiantGestionnaireRéseau,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';
import { expect } from 'chai';
import { mediator } from 'mediateur';
import { ConsulterProjetQuery } from '@potentiel/domain-views';
import { isNone } from '@potentiel/monads';

Quand(
  `le porteur modifie le gestionnaire de réseau de son projet avec un gestionnaire ayant le code EIC {string}`,
  async function (this: PotentielWorld, codeEIC: string) {
    try {
      await mediator.send<DomainUseCase>({
        type: 'MODIFIER_GESTIONNAIRE_RÉSEAU_PROJET_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(this.projetWorld.identifiantProjet),
          identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Alors(
  `le gestionaire de réseau {string} devrait être consultable dans le projet`,
  async function (this: PotentielWorld, raisonSociale: string) {
    const codeEIC = this.gestionnaireRéseauWorld.rechercherCodeEIC(raisonSociale);
    const résultat = await mediator.send<ConsulterProjetQuery>({
      type: 'CONSULTER_PROJET',
      data: {
        identifiantProjet: this.projetWorld.identifiantProjet,
      },
    });

    if (isNone(résultat)) {
      throw new Error('Projet non trouvé');
    }

    expect(résultat.identifiantGestionnaire).to.deep.equal({
      codeEIC,
    });
  },
);
