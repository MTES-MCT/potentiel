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
  `l'utilisateur invité a accès au projet {lauréat-éliminé}`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const identifiantProjet =
      statutProjet === 'éliminé'
        ? this.eliminéWorld.identifiantProjet.formatter()
        : this.lauréatWorld.identifiantProjet.formatter();

    await waitForExpect(() =>
      mediator.send<VérifierAccèsProjetQuery>({
        type: 'System.Authorization.VérifierAccèsProjet',
        data: {
          identifiantProjetValue: identifiantProjet,
          utilisateur: Utilisateur.bind({
            identifiantUtilisateur: Email.convertirEnValueType(
              this.utilisateurWorld.inviterUtilisateur.email,
            ),
            role: Role.convertirEnValueType(this.utilisateurWorld.inviterUtilisateur.rôle),
            identifiantGestionnaireRéseau:
              this.utilisateurWorld.inviterUtilisateur.identifiantGestionnaireRéseau ?? Option.none,
            région: this.utilisateurWorld.inviterUtilisateur.région ?? Option.none,
            nom: '',
          }),
        },
      }),
    );
  },
);

Alors(`l'utilisateur doit être invité`, async function (this: PotentielWorld) {
  await waitForExpect(async () => {
    const utilisateur = await mediator.send<TrouverUtilisateurQuery>({
      type: 'System.Utilisateur.Query.TrouverUtilisateur',
      data: {
        identifiantUtilisateur: this.utilisateurWorld.inviterUtilisateur.email,
      },
    });

    const actual = mapToPlainObject(utilisateur);
    const expected = mapToPlainObject(this.utilisateurWorld.mapToExpected());

    expect(actual).to.deep.equal(expected);
  });
});
