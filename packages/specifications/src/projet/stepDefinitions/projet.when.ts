import { When as Quand } from '@cucumber/cucumber';
import {
  DomainUseCase,
  convertirEnIdentifiantGestionnaireRéseau,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';
import { mediator } from 'mediateur';
import { PotentielWorld } from '../../potentiel.world';

Quand(
  `un porteur modifie le gestionnaire de réseau du projet {string} avec un gestionnaire non référencé`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    try {
      await mediator.send<DomainUseCase>({
        type: 'MODIFIER_GESTIONNAIRE_RÉSEAU_PROJET_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(
            'GESTIONNAIRE_NON_RÉFÉRENCÉ',
          ),
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `un porteur modifie le gestionnaire de réseau du projet {string} avec le gestionnaire {string}`,
  async function (this: PotentielWorld, nomProjet: string, raisonSocialGestionnaireRéseau: string) {
    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);
    const { codeEIC } = this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
      raisonSocialGestionnaireRéseau,
    );

    try {
      await mediator.send<DomainUseCase>({
        type: 'MODIFIER_GESTIONNAIRE_RÉSEAU_PROJET_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);
