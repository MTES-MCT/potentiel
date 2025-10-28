import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { assert, expect } from 'chai';

import { mapToPlainObject } from '@potentiel-domain/core';
import { ConsulterUtilisateurQuery, TrouverUtilisateurQuery } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { PotentielWorld } from '../../potentiel.world';
import { vérifierEmailEnvoyé } from '../../notification/stepDefinitions/notification.then';

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
