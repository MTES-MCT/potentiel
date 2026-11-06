import { Then as Alors } from '@cucumber/cucumber';
import { assert, expect } from 'chai';
import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { expectFileContent, waitForExpect } from '#helpers';
import type { PotentielWorld } from '../../../../potentiel.world.js';

async function listerProjetsEnAttenteDAchevement(this: PotentielWorld, depuis?: string) {
  const { items } = await mediator.send<Lauréat.Achèvement.ListerProjetsEnAttenteDAchevementQuery>({
    type: 'Lauréat.Achevement.Query.ListerProjetsEnAttenteDAchevement',
    data: {
      depuis: depuis ? DateTime.convertirEnValueType(depuis).formatter() : undefined,
      identifiantUtilisateur: this.utilisateurWorld.cocontractantFixture.email,
    },
  });

  return items.map(({ identifiantProjet }) => identifiantProjet.formatter());
}

const getDateInitiation = function (this: PotentielWorld) {
  return DateTime.convertirEnValueType(
    this.lauréatWorld.achèvementWorld.initierAchèvementFixture.initiéLe,
  );
};

Alors(
  `l'achèvement du projet lauréat devrait être en attente`,
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
        type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
        data: { identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter() },
      });

      assert(
        Option.isSome(achèvement),
        `Achèvement non trouvé pour le projet ${this.lauréatWorld.identifiantProjet.formatter()}`,
      );

      expect(achèvement.estAchevé).to.be.false;

      mapToPlainObject(achèvement).should.be.deep.equal(
        mapToPlainObject(this.lauréatWorld.achèvementWorld.mapToExpected()),
      );
      expect(achèvement.achèvementEnAttente).to.be.true;
    });
  },
);

Alors(
  `le projet lauréat devrait être listé dans les projets en attente d'achèvement`,
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const identifiants = await listerProjetsEnAttenteDAchevement.call(this);
      expect(identifiants).to.include(this.lauréatWorld.identifiantProjet.formatter());
    });
  },
);

Alors(
  `le projet lauréat ne devrait pas être listé dans les projets en attente d'achèvement`,
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const identifiants = await listerProjetsEnAttenteDAchevement.call(this);
      expect(identifiants).not.to.include(this.lauréatWorld.identifiantProjet.formatter());
    });
  },
);

Alors(
  `le projet lauréat devrait être listé dans les projets en attente d'achèvement depuis une date antérieure à l'initiation`,
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const identifiants = await listerProjetsEnAttenteDAchevement.call(
        this,
        getDateInitiation.call(this).retirerNombreDeJours(1).formatter(),
      );
      expect(identifiants).to.include(this.lauréatWorld.identifiantProjet.formatter());
    });
  },
);

Alors(
  `le projet lauréat ne devrait pas être listé dans les projets en attente d'achèvement depuis une date postérieure à l'initiation`,
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const identifiants = await listerProjetsEnAttenteDAchevement.call(
        this,
        getDateInitiation.call(this).ajouterNombreDeJours(1).formatter(),
      );
      expect(identifiants).not.to.include(this.lauréatWorld.identifiantProjet.formatter());
    });
  },
);

Alors(
  `l'achèvement réel du projet devrait être consultable`,
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const identifiantProjet = this.lauréatWorld.identifiantProjet;

      const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
        type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      assert(Option.isSome(achèvement), 'Non trouvé');
      assert(achèvement.estAchevé, 'Non achevé');
      const actual = mapToPlainObject(achèvement);
      const expected = mapToPlainObject(this.lauréatWorld.achèvementWorld.mapToExpected());

      actual.should.be.deep.equal(expected);

      await expectFileContent(
        achèvement.attestation,
        this.lauréatWorld.achèvementWorld.mapToAttestation(),
      );

      await expectFileContent(
        achèvement.rapportAssocié,
        this.lauréatWorld.achèvementWorld.mapToRapportAssocié(),
      );

      await expectFileContent(
        achèvement.preuveTransmissionAuCocontractant,
        this.lauréatWorld.achèvementWorld.mapToPreuveTransmissionAuCocontractant(),
      );
    });
  },
);

Alors(
  `la date d'achèvement prévisionnel du projet lauréat devrait être au {string}`,
  async function (this: PotentielWorld, datePrévisionnelleAttendue: string) {
    return waitForExpect(async () => {
      const identifiantProjet = this.lauréatWorld.identifiantProjet;

      const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
        type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      assert(Option.isSome(achèvement), `Aucun achèvement trouvé pour le projet`);

      const actual = achèvement.dateAchèvementPrévisionnel;
      const expected = Lauréat.Achèvement.DateAchèvementPrévisionnel.convertirEnValueType(
        DateTime.convertirEnValueType(new Date(datePrévisionnelleAttendue)).définirHeureÀMidi()
          .date,
      );

      expect(actual.formatter()).to.be.equal(expected.formatter());
    });
  },
);

Alors(
  `la date d'achèvement réel devrait être consultable pour le projet lauréat`,
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const identifiantProjet = this.lauréatWorld.identifiantProjet;

      const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
        type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      assert(Option.isSome(achèvement), `Aucun achèvement trouvé pour le projet`);
      assert(achèvement.estAchevé, `Le projet n'est pas achevé`);

      const expected = this.lauréatWorld.achèvementWorld.mapToExpected();
      assert(expected.estAchevé, `Le projet n'est pas achevé`);

      expect(achèvement.dateAchèvementRéel.estÉgaleÀ(expected.dateAchèvementRéel)).to.be.true;
    });
  },
);

Alors(
  `la date d'achèvement réel {string} devrait être consultable pour le projet lauréat`,
  async function (this: PotentielWorld, date: string) {
    return waitForExpect(async () => {
      const identifiantProjet = this.lauréatWorld.identifiantProjet;

      const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
        type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      assert(Option.isSome(achèvement), `Aucun achèvement trouvé pour le projet`);
      assert(achèvement.estAchevé, `Le projet n'est pas achevé`);

      expect(
        achèvement.dateAchèvementRéel.estÉgaleÀ(
          DateTime.convertirEnValueType(new Date(date).toISOString()),
        ),
      ).to.be.true;
    });
  },
);
