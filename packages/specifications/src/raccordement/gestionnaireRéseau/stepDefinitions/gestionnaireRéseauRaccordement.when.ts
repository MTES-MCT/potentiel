import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator, Message } from 'mediateur';
import { match } from 'ts-pattern';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Role } from '@potentiel-domain/utilisateur';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Email } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../potentiel.world.js';

Quand(
  `le porteur modifie le gestionnaire de réseau du projet avec un gestionnaire non référencé`,
  async function (this: PotentielWorld) {
    await modifierGestionnaireRéseauRaccordement.call(this, {
      world: this,
      codeEIC: 'GESTIONNAIRE NON RÉFÉRENCÉ',
      rôle: Role.porteur,
      email: Email.convertirEnValueType(this.utilisateurWorld.porteurFixture.email),
    });
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
    await modifierGestionnaireRéseauRaccordement.call(this, {
      world: this,
      codeEIC: GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu.codeEIC,
      //       // system can't be mocked as a role but it doesn't change anything here
      rôle: Role.porteur,
      email: Email.convertirEnValueType(this.utilisateurWorld.porteurFixture.email),
    });
  },
);

Quand(
  /(le porteur|la dreal|l'administrateur) modifie le gestionnaire de réseau du projet avec :/,
  async function (
    this: PotentielWorld,
    rôleString: 'le porteur' | 'la dreal' | "l'administrateur",
    datatable: DataTable,
  ) {
    const exemples = datatable.rowsHash();

    const { codeEIC } = this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
      exemples['raison sociale du gestionnaire réseau'],
    );

    const { email, rôle } = match(rôleString)
      .returnType<{
        rôle: Role.ValueType;
        email: Email.ValueType;
      }>()
      .with('le porteur', () => ({
        rôle: Role.porteur,
        email: Email.convertirEnValueType(this.utilisateurWorld.porteurFixture.email),
      }))
      .with('la dreal', () => ({
        rôle: Role.dreal,
        email: Email.convertirEnValueType(this.utilisateurWorld.drealFixture.email),
      }))
      .with("l'administrateur", () => ({
        rôle: Role.admin,
        email: Email.convertirEnValueType(this.utilisateurWorld.adminFixture.email),
      }))
      .exhaustive();

    await modifierGestionnaireRéseauRaccordement.call(this, {
      world: this,
      codeEIC,
      rôle,
      email,
    });
  },
);

type ModifierGestionnaireRéseauRaccordementProps = {
  world: PotentielWorld;
  codeEIC: string;
  rôle: Role.ValueType;
  email: Email.ValueType;
};

async function modifierGestionnaireRéseauRaccordement({
  world,
  codeEIC,
  rôle,
  email,
}: ModifierGestionnaireRéseauRaccordementProps) {
  const { identifiantProjet } = world.lauréatWorld;
  try {
    await mediator.send<Lauréat.Raccordement.ModifierGestionnaireRéseauRaccordementUseCase>({
      type: 'Lauréat.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        identifiantGestionnaireRéseauValue: codeEIC,
        rôleValue: rôle.nom,
        modifiéLeValue: new Date().toISOString(),
        modifiéParValue: email.formatter(),
      },
    });
  } catch (e) {
    world.error = e as Error;
  }
}
