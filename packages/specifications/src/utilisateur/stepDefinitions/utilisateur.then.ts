import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { expect } from 'chai';

import { mapToPlainObject } from '@potentiel-domain/core';
import {
  Role,
  TrouverUtilisateurQuery,
  Utilisateur,
  VérifierAccèsProjetQuery,
} from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { Email } from '@potentiel-domain/common';

import { PotentielWorld } from '../../potentiel.world';

Alors(
  `le nouveau porteur a accès au projet {lauréat-éliminé}`,
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
            fonction: '',
          }),
        },
      }),
    );
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
              fonction: Option.none,
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

Alors(`l'utilisateur doit être créé`, async function (this: PotentielWorld) {
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
