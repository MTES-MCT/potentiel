import { When as Quand } from '@cucumber/cucumber';
import { mediator, Message } from 'mediateur';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Role } from '@potentiel-domain/utilisateur';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

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

/** @deprecated AttribuerGestionnaireRéseauCommand n'est pas exporté par Raccordement  */
type AttribuerGestionnaireRéseauCommand = Message<
  'Lauréat.Raccordement.Command.AttribuerGestionnaireRéseau',
  {
    identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

Quand(
  `le système attribue un gestionnaire de réseau non référencé au projet`,
  async function (this: PotentielWorld) {
    try {
      await mediator.send<AttribuerGestionnaireRéseauCommand>({
        type: 'Lauréat.Raccordement.Command.AttribuerGestionnaireRéseau',
        data: {
          identifiantGestionnaireRéseau:
            GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
              'GESTIONNAIRE NON RÉFÉRENCÉ',
            ),
          identifiantProjet: this.lauréatWorld.identifiantProjet,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
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
  rôle: Role.ValueType,
) {
  const { identifiantProjet } = this.lauréatWorld;
  try {
    await mediator.send<Lauréat.Raccordement.ModifierGestionnaireRéseauRaccordementUseCase>({
      type: 'Lauréat.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        identifiantGestionnaireRéseauValue: codeEIC,
        rôleValue: rôle.nom,
      },
    });
  } catch (e) {
    this.error = e as Error;
  }
}
