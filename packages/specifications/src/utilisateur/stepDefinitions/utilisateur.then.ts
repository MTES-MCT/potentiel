import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { assert, expect } from 'chai';

import { mapToPlainObject } from '@potentiel-domain/core';
import {
  ConsulterUtilisateurQuery,
  ListerPorteursQuery,
  Role,
  TrouverUtilisateurQuery,
  Utilisateur,
  VérifierAccèsProjetQuery,
} from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { Email } from '@potentiel-domain/common';
import { ListerProjetsÀRéclamerQuery } from '@potentiel-domain/utilisateur';

import { PotentielWorld } from '../../potentiel.world';
import { vérifierEmailEnvoyé } from '../../notification/stepDefinitions/notification.then';

Alors(
  "l'utilisateur invité a accès au projet {lauréat-éliminé}",
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const identifiantProjet =
      statutProjet === 'éliminé'
        ? this.eliminéWorld.identifiantProjet.formatter()
        : this.lauréatWorld.identifiantProjet.formatter();

    const { rôle, identifiantGestionnaireRéseau, identifiantUtilisateur, région } =
      this.utilisateurWorld.mapToExpected();

    await waitForExpect(() =>
      mediator.send<VérifierAccèsProjetQuery>({
        type: 'System.Authorization.VérifierAccèsProjet',
        data: {
          identifiantProjetValue: identifiantProjet,
          utilisateur: Utilisateur.bind({
            identifiantUtilisateur,
            role: rôle,
            identifiantGestionnaireRéseau,
            région,
            nom: '',
          }),
        },
      }),
    );
  },
);

Alors(
  /(l'utilisateur|le porteur) devrait être désactivé/,
  async function (this: PotentielWorld, typeUtilisateur: "l'utilisateur" | 'le porteur') {
    const { email: identifiantUtilisateur } =
      typeUtilisateur === 'le porteur'
        ? this.utilisateurWorld.porteurFixture
        : this.utilisateurWorld.mapToExpected().identifiantUtilisateur;

    await waitForExpect(async () => {
      const utilisateur = await mediator.send<ConsulterUtilisateurQuery>({
        type: 'Utilisateur.Query.ConsulterUtilisateur',
        data: {
          identifiantUtilisateur,
        },
      });
      assert(Option.isSome(utilisateur), 'Utilisateur non trouvé');
      expect(utilisateur.désactivé).to.be.true;
    });
  },
);

Alors(
  /un email a été envoyé au (nouvel utilisateur|nouveau porteur) avec :/,
  async function (this: PotentielWorld, _: string, data: DataTable) {
    await vérifierEmailEnvoyé.call(this, this.utilisateurWorld.inviterUtilisateur.email, data);
  },
);

Alors(
  'la liste des porteurs du projet {lauréat-éliminé} est mise à jour',
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const identifiantProjet =
      statutProjet === 'éliminé'
        ? this.eliminéWorld.identifiantProjet.formatter()
        : this.lauréatWorld.identifiantProjet.formatter();

    const expectedPorteurs = [this.utilisateurWorld.porteurFixture.email];
    if (this.utilisateurWorld.inviterUtilisateur.aÉtéCréé) {
      expectedPorteurs.push(this.utilisateurWorld.inviterUtilisateur.email);
    }

    await waitForExpect(async () => {
      const porteurs = await mediator.send<ListerPorteursQuery>({
        type: 'Utilisateur.Query.ListerPorteurs',
        data: {
          identifiantProjet,
        },
      });

      for (const email of expectedPorteurs) {
        const expected = Email.convertirEnValueType(email);
        expect(porteurs.items.find((item) => item.identifiantUtilisateur.estÉgaleÀ(expected))).not
          .to.be.undefined;
      }
    });
  },
);

Alors(
  `le porteur ne doit plus avoir accès au projet {lauréat-éliminé}`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const identifiantProjet =
      statutProjet === 'éliminé'
        ? this.eliminéWorld.identifiantProjet.formatter()
        : this.lauréatWorld.identifiantProjet.formatter();

    const porteur = this.utilisateurWorld.porteurFixture;

    await waitForExpect(async () => {
      try {
        await mediator.send<VérifierAccèsProjetQuery>({
          type: 'System.Authorization.VérifierAccèsProjet',
          data: {
            identifiantProjetValue: identifiantProjet,
            utilisateur: Utilisateur.bind({
              identifiantUtilisateur: Email.convertirEnValueType(porteur.email),
              role: Role.convertirEnValueType(porteur.role),
              identifiantGestionnaireRéseau: Option.none,
              région: Option.none,
              nom: '',
            }),
          },
        });

        expect.fail("L'utilisateur ne devrait pas avoir accès au projet");
      } catch (error) {
        expect((error as Error).message).to.equal("Vous n'avez pas accès à ce projet");
      }
    });
  },
);

Alors(`l'utilisateur devrait être actif`, async function (this: PotentielWorld) {
  await waitForExpect(async () => {
    const utilisateur = await mediator.send<TrouverUtilisateurQuery>({
      type: 'System.Utilisateur.Query.TrouverUtilisateur',
      data: {
        identifiantUtilisateur: this.utilisateurWorld.réclamerProjet.aÉtéCréé
          ? this.utilisateurWorld.réclamerProjet.email
          : this.utilisateurWorld.inviterUtilisateur.email,
      },
    });

    const actual = mapToPlainObject(utilisateur);
    const expected = mapToPlainObject(this.utilisateurWorld.mapToExpected());

    expect(actual).to.deep.equal(expected);
  });
});

Alors(
  'le projet {lauréat-éliminé} est consultable dans la liste des projets à réclamer',
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const identifiantProjet =
      statutProjet === 'éliminé'
        ? this.eliminéWorld.identifiantProjet
        : this.lauréatWorld.identifiantProjet;

    await waitForExpect(async () => {
      const projets = await mediator.send<ListerProjetsÀRéclamerQuery>({
        type: 'Utilisateur.Query.ListerProjetsÀRéclamer',
        data: {},
      });
      expect(projets.items.find((item) => item.identifiantProjet.estÉgaleÀ(identifiantProjet))).not
        .to.be.undefined;
    });
  },
);

Alors(
  `le projet {lauréat-éliminé} n'est plus consultable dans la liste des projets à réclamer`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const identifiantProjet =
      statutProjet === 'éliminé'
        ? this.eliminéWorld.identifiantProjet
        : this.lauréatWorld.identifiantProjet;

    await waitForExpect(async () => {
      const projets = await mediator.send<ListerProjetsÀRéclamerQuery>({
        type: 'Utilisateur.Query.ListerProjetsÀRéclamer',
        data: {},
      });
      expect(projets.items.find((item) => item.identifiantProjet.estÉgaleÀ(identifiantProjet))).to
        .be.undefined;
    });
  },
);
