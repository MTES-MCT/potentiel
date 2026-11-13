import { Then as Alors, type DataTable } from '@cucumber/cucumber';
import { assert, expect } from 'chai';
import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { expectFileContent, waitForExpect } from '#helpers';
import type { PotentielWorld } from '../../../../potentiel.world.js';

Alors(
  `les données d'un projet lauréat devrait être consultable avec :`,
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    return waitForExpect(async () => {
      const projet = await consulterProjetPourAchèvement(
        this.lauréatWorld.identifiantProjet.formatter(),
      );

      assert(Option.isSome(projet), 'Projet non trouvé');
      expect(projet.identifiantProjet.formatter()).to.equal(
        this.lauréatWorld.identifiantProjet.formatter(),
      );
      expect(projet.nomProjet).to.equal(this.lauréatWorld.notifierLauréatFixture.nomProjet);
      expect(projet.statut.formatter()).to.equal(exemple['statut']);
      expect(projet.achèvementEnAttente).to.equal(exemple['achèvement en attente'] === 'oui');
    });
  },
);

Alors(`les données d'un projet lauréat inexistant ne devraient pas être consultable`, async () => {
  const projet = await consulterProjetPourAchèvement('PPE2 - Bâtiment#1##inexistant');

  expect(Option.isNone(projet)).to.be.true;
});

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
      expect(achèvement.achèvementEnAttente).to.be.true;

      mapToPlainObject(achèvement).should.be.deep.equal(
        mapToPlainObject(this.lauréatWorld.achèvementWorld.mapToExpected()),
      );
    });
  },
);

Alors(
  /le projet lauréat (devrait|ne devrait pas) être listé dans les projets en attente d'achèvement$/,
  async function (this: PotentielWorld, etat: 'devrait' | 'ne devrait pas') {
    return waitForExpect(async () => {
      const identifiants = await listerProjetsEnAttenteDAchèvement({ potentielWorld: this });

      if (etat === 'devrait') {
        expect(identifiants).to.include(this.lauréatWorld.identifiantProjet.formatter());
      } else {
        expect(identifiants).not.to.include(this.lauréatWorld.identifiantProjet.formatter());
      }
    });
  },
);

Alors(
  `le projet lauréat devrait être listé dans les projets en attente d'achèvement depuis une date antérieure à l'initiation`,
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const identifiants = await listerProjetsEnAttenteDAchèvement({
        potentielWorld: this,
        depuis: DateTime.convertirEnValueType(
          this.lauréatWorld.achèvementWorld.initierAchèvementFixture.initiéLe,
        )
          .retirerNombreDeJours(1)
          .formatter(),
      });
      expect(identifiants).to.include(this.lauréatWorld.identifiantProjet.formatter());
    });
  },
);

Alors(
  `le projet lauréat ne devrait pas être listé dans les projets en attente d'achèvement depuis une date postérieure à l'initiation`,
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const identifiants = await listerProjetsEnAttenteDAchèvement({
        potentielWorld: this,
        depuis: DateTime.convertirEnValueType(
          this.lauréatWorld.achèvementWorld.initierAchèvementFixture.initiéLe,
        )
          .ajouterNombreDeJours(1)
          .formatter(),
      });
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

const consulterProjetPourAchèvement = (identifiantProjetValue: string) =>
  mediator.send<Lauréat.Achèvement.ConsulterDonnéesProjetPourAchèvementQuery>({
    type: 'Lauréat.Achèvement.Query.ConsulterDonnéesProjetPourAchèvement',
    data: { identifiantProjetValue },
  });

type ListerProjetsEnAttenteDAchèvementProps = {
  potentielWorld: PotentielWorld;
  depuis?: string;
};

const listerProjetsEnAttenteDAchèvement = async ({
  potentielWorld,
  depuis,
}: ListerProjetsEnAttenteDAchèvementProps) => {
  const { items } = await mediator.send<Lauréat.Achèvement.ListerProjetsEnAttenteDAchèvementQuery>({
    type: 'Lauréat.Achèvement.Query.ListerProjetsEnAttenteDAchèvement',
    data: {
      depuis: depuis ? DateTime.convertirEnValueType(depuis).formatter() : undefined,
      identifiantUtilisateur: potentielWorld.utilisateurWorld.cocontractantFixture.email,
    },
  });

  return items.map(({ identifiantProjet }) => identifiantProjet.formatter());
};
