import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Role } from '@potentiel-domain/utilisateur';
import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../potentiel.world';
Quand(
  `le porteur modifie le gestionnaire de réseau du projet avec un gestionnaire non référencé`,
  async function (this: PotentielWorld) {
    await modifierGestionnaireRéseauRaccordement.call(
      this,
      'GESTIONNAIRE NON RÉFÉRENCÉ',
      Role.porteur,
    );
  },
);

Quand(
  `le système modifie le gestionnaire de réseau du projet avec un gestionnaire inconnu`,
  async function (this: PotentielWorld) {
    await modifierGestionnaireRéseauRaccordement.call(
      this,
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu.codeEIC,
      // system can't be mocked as a role but it doesn't change anything here
      Role.porteur,
    );
  },
);

Quand(
  `le porteur modifie le gestionnaire de réseau du projet avec le gestionnaire {string}`,
  async function (this: PotentielWorld, raisonSocialGestionnaireRéseau: string) {
    const { codeEIC } = this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
      raisonSocialGestionnaireRéseau,
    );

    await modifierGestionnaireRéseauRaccordement.call(this, codeEIC, Role.porteur);
  },
);

Quand(
  `une dreal modifie le gestionnaire de réseau du projet avec le gestionnaire {string}`,
  async function (this: PotentielWorld, raisonSocialGestionnaireRéseau: string) {
    const { codeEIC } = this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
      raisonSocialGestionnaireRéseau,
    );
    await modifierGestionnaireRéseauRaccordement.call(this, codeEIC, Role.dreal);
  },
);

async function modifierGestionnaireRéseauRaccordement(
  this: PotentielWorld,
  codeEIC: string,
  role: Role.ValueType,
) {
  const { identifiantProjet } = this.lauréatWorld;
  try {
    await mediator.send<Lauréat.Raccordement.ModifierGestionnaireRéseauRaccordementUseCase>({
      type: 'Lauréat.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        identifiantGestionnaireRéseauValue: codeEIC,
        rôleValue: role.nom,
      },
    });
  } catch (e) {
    this.error = e as Error;
  }
}
