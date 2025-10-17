import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { assert, expect } from 'chai';

import { mapToPlainObject } from '@potentiel-domain/core';
import { ConsulterUtilisateurQuery, TrouverUtilisateurQuery } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { Email } from '@potentiel-domain/common';
import { Accès } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../potentiel.world';
import { vérifierEmailEnvoyé } from '../../notification/stepDefinitions/notification.then';

Alors(
  "l'utilisateur invité a accès au projet {lauréat-éliminé}",
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    const { identifiantUtilisateur } = this.utilisateurWorld.mapToExpected();

    await waitForExpect(() =>
      mediator.send<Accès.VérifierAccèsProjetQuery>({
        type: 'System.Projet.Accès.Query.VérifierAccèsProjet',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          identifiantUtilisateurValue: identifiantUtilisateur.formatter(),
        },
      }),
    );
  },
);

Alors(
  "l'utilisateur invité n'a pas accès au projet {lauréat-éliminé}",
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    const { identifiantUtilisateur } = this.utilisateurWorld.mapToExpected();

    try {
      await mediator.send<Accès.VérifierAccèsProjetQuery>({
        type: 'System.Projet.Accès.Query.VérifierAccèsProjet',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          identifiantUtilisateurValue: identifiantUtilisateur.formatter(),
        },
      });
      expect.fail("L'utilisateur ne devrait pas avoir accès au projet");
    } catch {}
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
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    const expectedPorteurs = [this.utilisateurWorld.porteurFixture.email];
    if (this.utilisateurWorld.inviterUtilisateur.aÉtéCréé) {
      expectedPorteurs.push(this.utilisateurWorld.inviterUtilisateur.email);
    }

    await waitForExpect(async () => {
      const accèsProjet = await mediator.send<Accès.ConsulterAccèsQuery>({
        type: 'Projet.Accès.Query.ConsulterAccès',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(accèsProjet)) {
        throw new Error(`Il devrait y avoir des accès pour le projet !!`);
      }

      for (const email of expectedPorteurs) {
        const expected = Email.convertirEnValueType(email);
        expect(
          accèsProjet.utilisateursAyantAccès.find((utilisateur) => utilisateur.estÉgaleÀ(expected)),
        ).not.to.be.undefined;
      }
    });
  },
);

Alors(
  `le porteur ne doit plus avoir accès au projet {lauréat-éliminé}`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    const porteur = this.utilisateurWorld.porteurFixture;

    await waitForExpect(async () => {
      try {
        await mediator.send<Accès.VérifierAccèsProjetQuery>({
          type: 'System.Projet.Accès.Query.VérifierAccèsProjet',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            identifiantUtilisateurValue: porteur.email,
          },
        });
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

Alors(`le porteur devrait être actif`, async function (this: PotentielWorld) {
  await waitForExpect(async () => {
    const utilisateur = await mediator.send<TrouverUtilisateurQuery>({
      type: 'System.Utilisateur.Query.TrouverUtilisateur',
      data: {
        identifiantUtilisateur: this.utilisateurWorld.porteurFixture.email,
      },
    });

    assert(Option.isSome(utilisateur), 'porteur non trouvé');
    expect(utilisateur.désactivé).to.be.undefined;
  });
});

Alors(
  'le projet {lauréat-éliminé} est consultable dans la liste des projets à réclamer',
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    await waitForExpect(async () => {
      const projets = await mediator.send<Accès.ListerProjetsÀRéclamerQuery>({
        type: 'Projet.Accès.Query.ListerProjetsÀRéclamer',
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
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    await waitForExpect(async () => {
      const projets = await mediator.send<Accès.ListerProjetsÀRéclamerQuery>({
        type: 'Projet.Accès.Query.ListerProjetsÀRéclamer',
        data: {},
      });
      expect(projets.items.find((item) => item.identifiantProjet.estÉgaleÀ(identifiantProjet))).to
        .be.undefined;
    });
  },
);

// Accès
Alors(
  'le porteur devrait avoir accès au projet {lauréat-éliminé}',
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    const identifiantUtilisateurValue = this.utilisateurWorld.réclamerProjet.email;

    await waitForExpect(() =>
      mediator.send<Accès.VérifierAccèsProjetQuery>({
        type: 'System.Projet.Accès.Query.VérifierAccèsProjet',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          identifiantUtilisateurValue,
        },
      }),
    );
  },
);
