import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { assert, expect } from 'chai';

import { Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../../potentiel.world';
import { expectFileContent } from '../../../../helpers/expectFileContent';

Alors(
  'une attestation de conformité devrait être consultable pour le projet lauréat',
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
      const expected = mapToPlainObject(
        this.lauréatWorld.achèvementWorld.mapToExpected(identifiantProjet),
      );

      actual.should.be.deep.equal(expected);

      await expectFileContent(
        achèvement.attestation,
        this.lauréatWorld.achèvementWorld.mapToAttestation(),
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
  `la date d'achèvement devrait être consultable pour le projet lauréat`,
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

      const actual = achèvement.dateTransmissionAuCocontractant;
      const expected =
        this.lauréatWorld.achèvementWorld.transmettreDateAchèvementFixture.dateAchèvement;

      expect(actual.formatter()).to.be.equal(new Date(expected).toISOString());
    });
  },
);
