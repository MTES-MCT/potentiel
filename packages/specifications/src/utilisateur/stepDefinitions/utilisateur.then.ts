import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';

import { mapToPlainObject } from '@potentiel-domain/core';
import { ConsulterUtilisateurQuery, TrouverUtilisateurQuery } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { waitForExpect } from '#helpers';

import { PotentielWorld } from '../../potentiel.world.js';
import { vérifierEmailEnvoyé } from '../../notification/stepDefinitions/notification.then.js';

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
  'un email a été envoyé au nouvel utilisateur avec :',
  async function (this: PotentielWorld, data: DataTable) {
    await vérifierEmailEnvoyé.call(this, this.utilisateurWorld.inviterUtilisateur.email, data);
  },
);

Alors(
  'un email a été envoyé au nouveau porteur avec :',
  async function (this: PotentielWorld, data: DataTable) {
    await vérifierEmailEnvoyé.call(this, this.utilisateurWorld.inviterPorteur.email, data);
  },
);

Alors(`l'utilisateur devrait être actif`, async function (this: PotentielWorld) {
  await waitForExpect(async () => {
    const utilisateur = await mediator.send<TrouverUtilisateurQuery>({
      type: 'System.Utilisateur.Query.TrouverUtilisateur',
      data: {
        identifiantUtilisateur: this.utilisateurWorld.mapToExpected().identifiantUtilisateur.email,
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

Alors("l'utilisateur devrait être modifié", async function (this: PotentielWorld) {
  await waitForExpect(async () => {
    const utilisateur = await mediator.send<TrouverUtilisateurQuery>({
      type: 'System.Utilisateur.Query.TrouverUtilisateur',
      data: {
        identifiantUtilisateur: this.utilisateurWorld.modifierRôleUtilisateur.email,
      },
    });

    const actual = mapToPlainObject(utilisateur);
    const expected = mapToPlainObject(this.utilisateurWorld.mapToExpected());

    expect(actual).to.deep.equal(expected);
  });
});
