import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { faker } from '@faker-js/faker';

import { DateTime, Email } from '@potentiel-domain/common';
import {
  InviterPorteurUseCase,
  InviterUtilisateurUseCase,
  RetirerAccèsProjetUseCase,
  Role,
  RéclamerProjetUseCase,
} from '@potentiel-domain/utilisateur';

import { PotentielWorld } from '../../potentiel.world';
import { InviterUtilisateurFixture } from '../fixtures/inviter/inviter.fixture';
import { RéclamerProjetFixture } from '../fixtures/réclamer/réclamerProjet.fixture';

Quand(
  'le porteur invite un autre porteur sur le projet {lauréat-éliminé}',
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const { email: porteurInvité } = this.utilisateurWorld.inviterUtilisateur.aÉtéCréé
      ? this.utilisateurWorld.inviterUtilisateur
      : this.utilisateurWorld.inviterUtilisateur.créer({
          rôle: Role.porteur.nom,
        });
    const identifiantProjet =
      statutProjet === 'éliminé'
        ? this.eliminéWorld.identifiantProjet.formatter()
        : this.lauréatWorld.identifiantProjet.formatter();
    await inviterPorteur.call(this, {
      identifiantsProjet: [identifiantProjet],
      identifiantUtilisateur: porteurInvité,
    });
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

    await réclamerProjet.call(this, {
      identifiantProjet,
      email: porteur.email,
    });
  },
);

Quand(
  `un porteur réclame le projet {lauréat-éliminé} en connaissant le prix et le numéro CRE`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const identifiantProjet =
      statutProjet === 'éliminé'
        ? this.eliminéWorld.identifiantProjet.formatter()
        : this.lauréatWorld.identifiantProjet.formatter();

    const { prixReferenceValue, numéroCREValue } = this.candidatureWorld.importerCandidature.values;

    const porteur = this.utilisateurWorld.porteurFixture.créer({});

    await réclamerProjet.call(this, {
      identifiantProjet,
      email: porteur.email,
      prixRéférence: prixReferenceValue,
      numéroCRE: numéroCREValue,
    });
  },
);

Quand(
  `un porteur réclame le projet {lauréat-éliminé} sans connaître le prix et le numéro CRE`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const identifiantProjet =
      statutProjet === 'éliminé'
        ? this.eliminéWorld.identifiantProjet.formatter()
        : this.lauréatWorld.identifiantProjet.formatter();

    const porteur = this.utilisateurWorld.porteurFixture.créer({});
    await réclamerProjet.call(this, {
      identifiantProjet,
      email: porteur.email,
      prixRéférence: faker.number.float(),
      numéroCRE: faker.string.alphanumeric(),
    });
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

    await réclamerProjet.call(this, {
      identifiantProjet,
      email: porteur.email,
    });
  },
);

Quand(
  "un administrateur retire l'accès de l'utilisateur au projet {lauréat-éliminé}",
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const identifiantProjet =
      statutProjet === 'éliminé'
        ? this.eliminéWorld.identifiantProjet.formatter()
        : this.lauréatWorld.identifiantProjet.formatter();
    await retirerAccèsProjet.call(this, {
      identifiantProjet,
      identifiantUtilisateur: this.utilisateurWorld.porteurFixture.email,
    });
  },
);

Quand('un porteur retire ses accès au projet lauréat', async function (this: PotentielWorld) {
  await retirerAccèsProjet.call(this, {
    identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
    identifiantUtilisateur: this.utilisateurWorld.porteurFixture.email,
    retiréPar: this.utilisateurWorld.porteurFixture.email,
  });
});

export async function inviterPorteur(
  this: PotentielWorld,
  {
    identifiantsProjet,
    identifiantUtilisateur,
  }: {
    identifiantsProjet: string[];
    identifiantUtilisateur: string;
  },
) {
  try {
    await mediator.send<InviterPorteurUseCase>({
      type: 'Utilisateur.UseCase.InviterPorteur',
      data: {
        identifiantsProjetValues: identifiantsProjet,
        identifiantUtilisateurValue: identifiantUtilisateur,
        invitéLeValue: DateTime.now().formatter(),
        invitéParValue: this.utilisateurWorld.porteurFixture.aÉtéCréé
          ? this.utilisateurWorld.porteurFixture.email
          : Email.system().formatter(),
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}

export async function inviterUtilisateur(
  this: PotentielWorld,
  props: Parameters<typeof InviterUtilisateurFixture.prototype.créer>[0],
) {
  const {
    email: utilisateurInvité,
    rôle: rôleValue,
    région,
    identifiantGestionnaireRéseau,
    fonction,
    nomComplet,
  } = this.utilisateurWorld.inviterUtilisateur.créer(props);
  try {
    await mediator.send<InviterUtilisateurUseCase>({
      type: 'Utilisateur.UseCase.InviterUtilisateur',
      data: {
        identifiantUtilisateurValue: utilisateurInvité,
        invitéLeValue: DateTime.now().formatter(),
        invitéParValue: this.utilisateurWorld.adminFixture.email,
        rôleValue,
        régionValue: région,
        identifiantGestionnaireRéseauValue: identifiantGestionnaireRéseau,
        fonctionValue: fonction,
        nomCompletValue: nomComplet,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}

export async function retirerAccèsProjet(
  this: PotentielWorld,
  {
    identifiantProjet,
    identifiantUtilisateur,
    retiréPar,
  }: { identifiantProjet: string; identifiantUtilisateur: string; retiréPar?: string },
) {
  try {
    await mediator.send<RetirerAccèsProjetUseCase>({
      type: 'Utilisateur.UseCase.RetirerAccèsProjet',
      data: {
        identifiantProjet,
        identifiantUtilisateur,
        retiréLe: DateTime.now().formatter(),
        retiréPar: retiréPar ?? this.utilisateurWorld.adminFixture.email,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}

async function réclamerProjet(
  this: PotentielWorld,
  fixtureProps: Parameters<typeof RéclamerProjetFixture.prototype.créer>[0],
) {
  const { identifiantProjet, email, numéroCRE, prixRéférence } =
    this.utilisateurWorld.réclamerProjet.créer(fixtureProps);

  try {
    await mediator.send<RéclamerProjetUseCase>({
      type: 'Utilisateur.UseCase.RéclamerProjet',
      data: {
        identifiantProjet,
        identifiantUtilisateur: email,
        réclaméLe: DateTime.now().formatter(),
        numéroCRE,
        prixRéférence,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}
