import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';

import { Accès, IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { Email } from '@potentiel-domain/common';
import { mapToPlainObject } from '@potentiel-domain/core';

import { waitForExpect } from '#helpers';

import { PotentielWorld } from '../../potentiel.world.js';

Alors(
  "l'utilisateur invité a accès au projet {lauréat-éliminé}",
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    await vérifierAccèsProjet.call(this, {
      identifiantProjet,
      expectHasAccess: true,
    });
  },
);

Alors(
  "l'utilisateur invité a accès au projet {lauréat-éliminé} {string}",
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé', nomProjet: string) {
    const { identifiantProjet } =
      statutProjet === 'éliminé'
        ? this.éliminéWorld.rechercherÉliminéFixture(nomProjet)
        : this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await vérifierAccèsProjet.call(this, {
      identifiantProjet,
      expectHasAccess: true,
    });
  },
);

Alors(
  "l'utilisateur invité n'a pas accès au projet {lauréat-éliminé}",
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    await vérifierAccèsProjet.call(this, {
      identifiantProjet,
      expectHasAccess: false,
    });
  },
);

Alors("l'utilisateur invité n'a pas accès à la candidature", async function (this: PotentielWorld) {
  const { identifiantProjet } = this.candidatureWorld.importerCandidature;

  await vérifierAccèsProjet.call(this, {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    expectHasAccess: false,
  });
});

Alors(
  `le porteur ne doit plus avoir accès au projet {lauréat-éliminé}`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    await waitForExpect(() =>
      vérifierAccèsProjet.call(this, {
        identifiantProjet,
        identifiantUtilisateur: this.utilisateurWorld.porteurFixture.email,
        expectHasAccess: false,
      }),
    );
  },
);

Alors(
  "l'utilisateur invité n'a pas accès au projet {lauréat-éliminé} {string}",
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé', nomProjet: string) {
    const { identifiantProjet } =
      statutProjet === 'éliminé'
        ? this.éliminéWorld.rechercherÉliminéFixture(nomProjet)
        : this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await vérifierAccèsProjet.call(this, {
      identifiantProjet,
      expectHasAccess: false,
    });
  },
);

Alors(
  'le porteur a accès au projet {lauréat-éliminé}',
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    await waitForExpect(() =>
      vérifierAccèsProjet.call(this, {
        identifiantProjet,
        expectHasAccess: true,
      }),
    );
  },
);

Alors(
  'le porteur {string} a accès au projet {lauréat-éliminé}',
  async function (this: PotentielWorld, email: string, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    await waitForExpect(() =>
      vérifierAccèsProjet.call(this, {
        identifiantProjet,
        identifiantUtilisateur: email,
        expectHasAccess: true,
      }),
    );
  },
);

Alors(
  `le porteur n'a pas accès au projet {lauréat-éliminé}`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    await waitForExpect(() =>
      vérifierAccèsProjet.call(this, {
        identifiantProjet,
        expectHasAccess: false,
      }),
    );
  },
);

Alors(
  `le porteur {string} n'a pas accès au projet {lauréat-éliminé}`,
  async function (this: PotentielWorld, email: string, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    await waitForExpect(() =>
      vérifierAccèsProjet.call(this, {
        identifiantProjet,
        identifiantUtilisateur: email,
        expectHasAccess: false,
      }),
    );
  },
);

Alors(
  `le porteur n'a pas accès au projet {lauréat-éliminé} {string}`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé', nomProjet: string) {
    const { identifiantProjet } =
      statutProjet === 'éliminé'
        ? this.éliminéWorld.rechercherÉliminéFixture(nomProjet)
        : this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(() =>
      vérifierAccèsProjet.call(this, {
        identifiantProjet,
        expectHasAccess: true,
      }),
    );
  },
);

Alors(
  'la liste des porteurs du projet {lauréat-éliminé} est mise à jour',
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    const expectedPorteursValues = this.accèsWorld.remplacerAccèsProjet.aÉtéCréé
      ? [this.accèsWorld.remplacerAccèsProjet.email]
      : [this.utilisateurWorld.porteurFixture.email];

    if (this.utilisateurWorld.inviterPorteur.aÉtéCréé) {
      expectedPorteursValues.push(this.utilisateurWorld.inviterPorteur.email);
    }

    const expectedPorteurs = mapToPlainObject(
      expectedPorteursValues
        .map(Email.convertirEnValueType)
        .map((utilisateur) => utilisateur.formatter())
        .sort(),
    );

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
      const actualPorteurs = accèsProjet.utilisateursAyantAccès
        .map((utilisateur) => utilisateur.formatter())
        .sort();
      expect(actualPorteurs).to.deep.eq(expectedPorteurs);
    });
  },
);

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

async function vérifierAccèsProjet(
  this: PotentielWorld,
  {
    expectHasAccess,
    identifiantProjet,
    identifiantUtilisateur,
  }: {
    identifiantProjet: IdentifiantProjet.ValueType;
    expectHasAccess: boolean;
    identifiantUtilisateur?: string;
  },
) {
  const identifiantUtilisateurValue =
    identifiantUtilisateur ??
    this.utilisateurWorld.mapToExpected().identifiantUtilisateur.formatter();

  try {
    await mediator.send<Accès.VérifierAccèsProjetQuery>({
      type: 'System.Projet.Accès.Query.VérifierAccèsProjet',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        identifiantUtilisateurValue,
      },
    });
    if (expectHasAccess) {
      return;
    }
  } catch (error) {
    if (expectHasAccess === false) {
      expect((error as Error).message).to.equal("Vous n'avez pas accès à ce projet");
      return;
    }
    assert.fail("L'utilisateur devrait avoir accès au projet");
  }
  assert.fail("L'utilisateur ne devrait pas avoir accès au projet");
}
