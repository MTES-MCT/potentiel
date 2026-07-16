import { Then as Alors } from '@cucumber/cucumber';
import { assert, expect } from 'chai';
import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { expectFileContent, waitForExpect } from '#helpers';
import type { PotentielWorld } from '../../../../potentiel.world.js';

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
