import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { faker } from '@faker-js/faker';

import { DateTime, Email } from '@potentiel-domain/common';
import {
  InviterPorteurUseCase,
  InviterUtilisateurUseCase,
  Role,
  DésactiverUtilisateurUseCase,
  RéactiverUtilisateurUseCase,
  CréerPorteurUseCase,
} from '@potentiel-domain/utilisateur';
import { Accès } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../potentiel.world';
import { InviterUtilisateurFixture } from '../fixtures/inviter/inviter.fixture';
import { RéclamerProjetFixture } from '../fixtures/réclamer/réclamerProjet.fixture';

Quand(
  /le porteur invite (un autre porteur|l'administrateur) sur le projet (lauréat|éliminé)/,
  async function (
    this: PotentielWorld,
    utilisateurInvité: 'un autre porteur' | "l'administrateur",
    statutProjet: 'lauréat' | 'éliminé',
  ) {
    const { email: porteurInvité } =
      utilisateurInvité === "l'administrateur"
        ? this.utilisateurWorld.adminFixture
        : this.utilisateurWorld.inviterUtilisateur.aÉtéCréé &&
            this.utilisateurWorld.inviterUtilisateur.rôle === Role.porteur.nom
          ? this.utilisateurWorld.inviterUtilisateur
          : this.utilisateurWorld.inviterUtilisateur.créer({
              rôle: Role.porteur.nom,
            });
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;
    await inviterPorteur.call(this, {
      identifiantsProjet: [identifiantProjet.formatter()],
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

Quand(`un administrateur désactive l'utilisateur`, async function (this: PotentielWorld) {
  await désactiverUtilisateur.call(this, {
    identifiantUtilisateur: this.utilisateurWorld.inviterUtilisateur.email,
  });
});

Quand(`un administrateur désactive le porteur du projet`, async function (this: PotentielWorld) {
  await désactiverUtilisateur.call(this, {
    identifiantUtilisateur: this.utilisateurWorld.porteurFixture.email,
  });
});

Quand(`l'utilisateur désactive son compte`, async function (this: PotentielWorld) {
  await désactiverUtilisateur.call(this, {
    identifiantUtilisateur: this.utilisateurWorld.inviterUtilisateur.email,
    désactivéPar: this.utilisateurWorld.inviterUtilisateur.email,
  });
});

Quand(`un administrateur réactive l'utilisateur`, async function (this: PotentielWorld) {
  await réactiverUtilisateur.call(this, {
    identifiantUtilisateur: this.utilisateurWorld.inviterUtilisateur.email,
  });
});

Quand(`un administrateur réactive le porteur du projet`, async function (this: PotentielWorld) {
  await réactiverUtilisateur.call(this, {
    identifiantUtilisateur: this.utilisateurWorld.porteurFixture.email,
  });
});

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
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    const { emailContactValue: emailCandidature } =
      this.candidatureWorld.importerCandidature.values;
    const porteur = this.utilisateurWorld.porteurFixture.créer({
      email: emailCandidature,
    });

    await réclamerProjet.call(this, {
      identifiantProjet: identifiantProjet.formatter(),
      email: porteur.email,
    });
  },
);

Quand(
  `un porteur réclame le projet {lauréat-éliminé} en connaissant le prix et le numéro CRE`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    const { dépôtValue } = this.candidatureWorld.importerCandidature;

    const porteur = this.utilisateurWorld.porteurFixture.créer();

    await réclamerProjet.call(this, {
      identifiantProjet: identifiantProjet.formatter(),
      email: porteur.email,
      prixRéférence: dépôtValue.prixReference,
      numéroCRE: identifiantProjet.numéroCRE,
    });
  },
);

Quand(
  `un porteur réclame le projet {lauréat-éliminé} sans connaître le prix et le numéro CRE`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    const porteur = this.utilisateurWorld.porteurFixture.créer({});
    await réclamerProjet.call(this, {
      identifiantProjet: identifiantProjet.formatter(),
      email: porteur.email,
      prixRéférence: faker.number.float(),
      numéroCRE: faker.string.alphanumeric(),
    });
  },
);

Quand(
  `un porteur réclame le projet {lauréat-éliminé} avec un email différent de celui de la candidature`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    const porteur = this.utilisateurWorld.porteurFixture.créer({});

    await réclamerProjet.call(this, {
      identifiantProjet: identifiantProjet.formatter(),
      email: porteur.email,
    });
  },
);

Quand(`un porteur réclame la candidature lauréate`, async function (this: PotentielWorld) {
  const {
    identifiantProjet,
    values: { emailContactValue },
  } = this.candidatureWorld.importerCandidature;

  const porteur = this.utilisateurWorld.porteurFixture.créer({ email: emailContactValue });

  await réclamerProjet.call(this, {
    identifiantProjet,
    email: porteur.email,
  });
});

Quand(
  "un administrateur retire l'accès de l'utilisateur au projet {lauréat-éliminé}",
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    await retirerAccèsProjet.call(this, {
      identifiantProjet: identifiantProjet.formatter(),
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
          : Email.système.formatter(),
      },
    });

    for (const identifiantProjetValue of identifiantsProjet) {
      await mediator.send<Accès.AutoriserAccèsProjetUseCase>({
        type: 'Projet.Accès.UseCase.AutoriserAccèsProjet',
        data: {
          identifiantProjetValue,
          identifiantUtilisateurValue: identifiantUtilisateur,
          autoriséLeValue: DateTime.now().formatter(),
          autoriséParValue: this.utilisateurWorld.porteurFixture.aÉtéCréé
            ? this.utilisateurWorld.porteurFixture.email
            : Email.système.formatter(),
          raison: 'invitation',
        },
      });
    }
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

export async function désactiverUtilisateur(
  this: PotentielWorld,
  {
    identifiantUtilisateur,
    désactivéPar,
  }: { identifiantUtilisateur: string; désactivéPar?: string },
) {
  try {
    await mediator.send<DésactiverUtilisateurUseCase>({
      type: 'Utilisateur.UseCase.DésactiverUtilisateur',
      data: {
        identifiantUtilisateurValue: identifiantUtilisateur,
        désactivéLeValue: DateTime.now().formatter(),
        désactivéParValue: désactivéPar ?? this.utilisateurWorld.adminFixture.email,
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
    await mediator.send<Accès.RetirerAccèsProjetUseCase>({
      type: 'Projet.Accès.UseCase.RetirerAccèsProjet',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: identifiantUtilisateur,
        retiréLeValue: DateTime.now().formatter(),
        retiréParValue: retiréPar ?? this.utilisateurWorld.adminFixture.email,
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
  const {
    identifiantProjet,
    email,
    numéroCRE,
    prixRéférence: prix,
  } = this.utilisateurWorld.réclamerProjet.créer(fixtureProps);

  try {
    const avecPrixEtNuméroCRE = numéroCRE !== undefined && prix !== undefined;

    await mediator.send<CréerPorteurUseCase>({
      type: 'Utilisateur.UseCase.CréerPorteur',
      data: {
        identifiantUtilisateurValue: email,
      },
    });

    await mediator.send<Accès.RéclamerAccèsProjetUseCase>({
      type: 'Projet.Accès.UseCase.RéclamerAccèsProjet',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: email,
        dateRéclamationValue: DateTime.now().formatter(),
        ...(avecPrixEtNuméroCRE
          ? { type: 'avec-prix-numéro-cre', numéroCRE, prix }
          : { type: 'même-email-candidature' }),
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}

export async function réactiverUtilisateur(
  this: PotentielWorld,
  { identifiantUtilisateur }: { identifiantUtilisateur: string },
) {
  try {
    await mediator.send<RéactiverUtilisateurUseCase>({
      type: 'Utilisateur.UseCase.RéactiverUtilisateur',
      data: {
        identifiantUtilisateurValue: identifiantUtilisateur,
        réactivéLeValue: DateTime.now().formatter(),
        réactivéParValue: this.utilisateurWorld.adminFixture.email,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}
