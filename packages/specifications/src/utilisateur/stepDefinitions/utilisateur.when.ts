import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import {
  InviterPorteurUseCase,
  InviterUtilisateurUseCase,
  Role,
  RéclamerProjetUseCase,
} from '@potentiel-domain/utilisateur';

import { PotentielWorld } from '../../potentiel.world';
import { InviterUtilisateurFixture } from '../fixtures/inviter/inviter.fixture';

Quand(
  'le porteur invite un autre porteur sur le projet {lauréat-éliminé}',
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const porteurExistant = this.utilisateurWorld.porteurFixture.email;
    const { email: porteurInvité } = this.utilisateurWorld.inviterUtilisateur.aÉtéCréé
      ? this.utilisateurWorld.inviterUtilisateur
      : this.utilisateurWorld.inviterUtilisateur.créer({
          rôle: Role.porteur.nom,
        });
    const identifiantProjet =
      statutProjet === 'éliminé'
        ? this.eliminéWorld.identifiantProjet.formatter()
        : this.lauréatWorld.identifiantProjet.formatter();
    try {
      await mediator.send<InviterPorteurUseCase>({
        type: 'Utilisateur.UseCase.InviterPorteur',
        data: {
          identifiantsProjetValues: [identifiantProjet],
          identifiantUtilisateurValue: porteurInvité,
          invitéLeValue: DateTime.now().formatter(),
          invitéParValue: porteurExistant,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'un administrateur invite un utilisateur avec le rôle {string}',
  async function (this: PotentielWorld, rôle: string) {
    await inviterUtilisateur.call(this, { rôle });
  },
);

Quand('un administrateur réinvite le même utilisateur', async function (this: PotentielWorld) {
  const { email, rôle } = this.utilisateurWorld.inviterUtilisateur;
  await inviterUtilisateur.call(this, { email, rôle });
});

Quand('un administrateur invite un dgec validateur', async function (this: PotentielWorld) {
  await inviterUtilisateur.call(this, {
    rôle: Role.dgecValidateur.nom,
    fonction: 'Fonction du DGEC Validateur',
    nomComplet: 'Nom du DGEC Validateur',
  });
});

Quand(
  'un administrateur invite une dreal pour la région du projet',
  async function (this: PotentielWorld) {
    await inviterUtilisateur.call(this, {
      rôle: Role.dreal.nom,
      région: this.candidatureWorld.importerCandidature.values.localitéValue.région,
    });
  },
);

Quand(
  'un administrateur invite un gestionnaire de réseau attribué au raccordement du projet lauréat',
  async function (this: PotentielWorld) {
    await inviterUtilisateur.call(this, {
      rôle: Role.grd.nom,
      identifiantGestionnaireRéseau: this.raccordementWorld.identifiantGestionnaireRéseau,
    });
  },
);

Quand(
  `un porteur réclame le projet {lauréat-éliminé} avec le même email que celui de la candidature`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const identifiantProjet =
      statutProjet === 'éliminé'
        ? this.eliminéWorld.identifiantProjet.formatter()
        : this.lauréatWorld.identifiantProjet.formatter();

    const { emailContactValue: emailCandidature } =
      this.candidatureWorld.importerCandidature.values;
    const porteur = this.utilisateurWorld.porteurFixture.créer({
      email: emailCandidature,
    });
    const { email } = this.utilisateurWorld.réclamerProjet.créer({
      identifiantProjet,
      email: porteur.email,
    });

    try {
      await mediator.send<RéclamerProjetUseCase>({
        type: 'Utilisateur.UseCase.RéclamerProjet',
        data: {
          identifiantProjet,
          identifiantUtilisateur: email,
          réclaméLe: DateTime.now().formatter(),
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un porteur réclame le projet {lauréat-éliminé} avec un email différent de celui de la candidature`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const identifiantProjet =
      statutProjet === 'éliminé'
        ? this.eliminéWorld.identifiantProjet.formatter()
        : this.lauréatWorld.identifiantProjet.formatter();

    const porteur = this.utilisateurWorld.porteurFixture.créer({});
    const { email } = this.utilisateurWorld.réclamerProjet.créer({
      identifiantProjet,
      email: porteur.email,
    });

    try {
      await mediator.send<RéclamerProjetUseCase>({
        type: 'Utilisateur.UseCase.RéclamerProjet',
        data: {
          identifiantProjet,
          identifiantUtilisateur: email,
          réclaméLe: DateTime.now().formatter(),
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

export async function inviterUtilisateur(
  this: PotentielWorld,
  props: Parameters<typeof InviterUtilisateurFixture.prototype.créer>[0],
) {
  const {
    email: utilisateurInvité,
    rôle: rôleValue,
    région,
    identifiantGestionnaireRéseau,
  } = this.utilisateurWorld.inviterUtilisateur.créer(props);
  try {
    await mediator.send<InviterUtilisateurUseCase>({
      type: 'Utilisateur.UseCase.InviterUtilisateur',
      data: {
        identifiantUtilisateurValue: utilisateurInvité,
        invitéLeValue: DateTime.now().formatter(),
        invitéParValue: this.utilisateurWorld.adminFixture.email,
        rôleValue,
        région,
        identifiantGestionnaireRéseau,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}
