import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { expect } from 'chai';

import { Achèvement } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { Option } from '@potentiel-libraries/monads';

import { PotentielWorld } from '../../../../../potentiel.world';
import { convertReadableStreamToString } from '../../../../../helpers/convertReadableToString';

Alors(
  'une attestation de conformité devrait être consultable pour le projet lauréat',
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const identifiantProjet = this.lauréatWorld.identifiantProjet;

      const achèvement = await mediator.send<Achèvement.ConsulterAttestationConformitéQuery>({
        type: 'Lauréat.Achèvement.AttestationConformité.Query.ConsulterAttestationConformité',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

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

      const actualPreuveContent = await convertReadableStreamToString(preuve.content);
      const expectedPreuveContent = await convertReadableStreamToString(
        this.lauréatWorld.achèvementWorld.transmettreOuModifierAttestationConformitéFixture.preuve
          .content ?? new ReadableStream(),
      );

      expect(actualPreuveContent).to.be.equal(expectedPreuveContent);
    });
  },
);
