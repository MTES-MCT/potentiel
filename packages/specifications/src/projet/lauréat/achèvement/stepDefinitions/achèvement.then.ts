import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { assert, expect } from 'chai';

import { Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { Option } from '@potentiel-libraries/monads';

import { PotentielWorld } from '../../../../potentiel.world';
import { convertReadableStreamToString } from '../../../../helpers/convertReadableToString';

Alors(
  'une attestation de conformité devrait être consultable pour le projet lauréat',
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const identifiantProjet = this.lauréatWorld.identifiantProjet;

      const achèvement =
        await mediator.send<Lauréat.Achèvement.AttestationConformité.ConsulterAttestationConformitéQuery>(
          {
            type: 'Lauréat.Achèvement.AttestationConformité.Query.ConsulterAttestationConformité',
            data: {
              identifiantProjetValue: identifiantProjet.formatter(),
            },
          },
        );

      const actual = mapToPlainObject(achèvement);
      const expected = mapToPlainObject(
        this.lauréatWorld.achèvementWorld.mapToExpected(identifiantProjet),
      );

      actual.should.be.deep.equal(expected);

      const attestation = await mediator.send<ConsulterDocumentProjetQuery>({
        type: 'Document.Query.ConsulterDocumentProjet',
        data: {
          documentKey: Option.match(achèvement)
            .some((a) => a.attestation.formatter() ?? '')
            .none(() => ''),
        },
      });

      assert(Option.isSome(attestation), `Attestation de conformité non trouvée !`);

      const actualAttestationContent = await convertReadableStreamToString(attestation.content);
      const expectedAttestationContent = await convertReadableStreamToString(
        this.lauréatWorld.achèvementWorld.transmettreOuModifierAttestationConformitéFixture
          .attestation.content ?? new ReadableStream(),
      );

      expect(actualAttestationContent).to.be.equal(expectedAttestationContent);

      const preuve = await mediator.send<ConsulterDocumentProjetQuery>({
        type: 'Document.Query.ConsulterDocumentProjet',
        data: {
          documentKey: Option.match(achèvement)
            .some((a) => a.preuveTransmissionAuCocontractant.formatter() ?? '')
            .none(() => ''),
        },
      });

      assert(Option.isSome(preuve), `Preuve d'attestation de conformité non trouvée !`);

      const actualPreuveContent = await convertReadableStreamToString(preuve.content);
      const expectedPreuveContent = await convertReadableStreamToString(
        this.lauréatWorld.achèvementWorld.transmettreOuModifierAttestationConformitéFixture.preuve
          .content ?? new ReadableStream(),
      );

      expect(actualPreuveContent).to.be.equal(expectedPreuveContent);
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
        new Date(datePrévisionnelleAttendue),
      );

      expect(actual.formatter()).to.be.equal(expected.formatter());
    });
  },
);
