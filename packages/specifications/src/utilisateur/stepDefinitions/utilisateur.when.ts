import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import {
  InviterPorteurUseCase,
  InviterUtilisateurUseCase,
  Role,
  DésactiverUtilisateurUseCase,
  RéactiverUtilisateurUseCase,
  Zone,
} from '@potentiel-domain/utilisateur';
import { Accès } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../potentiel.world';
import { InviterUtilisateurProps } from '../fixtures/inviter/inviter.fixture';

import { getPayloadForRôle } from './utilisateur.given';

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
    await inviterUtilisateur.call(this, getPayloadForRôle.call(this, rôle));
  },
);

Quand(
  'un administrateur invite un utilisateur avec :',
  async function (this: PotentielWorld, datatable: DataTable) {
    const exemple = datatable.rowsHash();
    await inviterUtilisateur.call(this, this.utilisateurWorld.mapExempleToFixtureData(exemple));
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

Quand(`l'utilisateur désactive son propre compte`, async function (this: PotentielWorld) {
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
  await inviterUtilisateur.call(this, getPayloadForRôle.call(this, Role.dgecValidateur.nom));
});

Quand(
  'un administrateur invite une dreal pour la région du projet',
  async function (this: PotentielWorld) {
    await inviterUtilisateur.call(this, getPayloadForRôle.call(this, Role.dreal.nom));
  },
);

Quand(
  'un administrateur invite une dreal pour la région {string}',
  async function (this: PotentielWorld, région: string) {
    await inviterUtilisateur.call(this, {
      ...getPayloadForRôle.call(this, Role.dreal.nom),
      rôle: Role.dreal.nom,
      région,
    });
  },
);

Quand(
  'un administrateur invite un cocontractant pour la zone {string}',
  async function (this: PotentielWorld, zone: string) {
    await inviterUtilisateur.call(this, {
      rôle: Role.cocontractant.nom,
      zone: Zone.convertirEnValueType(zone).nom,
    });
  },
);

Quand(
  'un administrateur invite un cocontractant pour la zone du projet',
  async function (this: PotentielWorld) {
    await inviterUtilisateur.call(this, getPayloadForRôle.call(this, Role.cocontractant.nom));
  },
);

Quand(
  'un administrateur invite un gestionnaire de réseau attribué au raccordement du projet lauréat',
  async function (this: PotentielWorld) {
    await inviterUtilisateur.call(this, getPayloadForRôle.call(this, Role.grd.nom));
  },
);

Quand(
  'un administrateur invite le gestionnaire de réseau {string}',
  async function (this: PotentielWorld, grd: string) {
    await inviterUtilisateur.call(this, {
      ...getPayloadForRôle.call(this, Role.grd.nom),
      rôle: Role.grd.nom,
      identifiantGestionnaireRéseau:
        this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(grd).codeEIC,
    });
  },
);

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

export async function inviterUtilisateur(this: PotentielWorld, props: InviterUtilisateurProps) {
  const {
    email: utilisateurInvité,
    rôle: rôleValue,
    région,
    zone,
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
        zoneValue: zone,
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
