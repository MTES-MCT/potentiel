import { Then as Alors } from '@cucumber/cucumber';
import waitForExpect from 'wait-for-expect';
import { mediator } from 'mediateur';
import { expect } from 'chai';

import { Option } from '@potentiel-libraries/monads';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { PotentielWorld } from '../../../../../potentiel.world';
import { convertReadableStreamToString } from '../../../../../helpers/convertReadableToString';

Alors(
  /une demande de changement de représentant légal du projet lauréat devrait être consultable/,
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const { identifiantProjet } = this.lauréatWorld;

      const représentantLégal = await mediator.send<ReprésentantLégal.ReprésentantLégalQuery>({
        type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      const actual = mapToPlainObject(représentantLégal);
      const expected = mapToPlainObject(
        this.lauréatWorld.représentantLégalWorld.mapToExpected(identifiantProjet),
      );

      actual.should.be.deep.equal(expected);

      console.log(
        this.lauréatWorld.représentantLégalWorld.demanderChangementReprésentantLégalFixture,
      );

      if (
        this.lauréatWorld.représentantLégalWorld.demanderChangementReprésentantLégalFixture.aÉtéCréé
      ) {
        const result = await mediator.send<ConsulterDocumentProjetQuery>({
          type: 'Document.Query.ConsulterDocumentProjet',
          data: {
            documentKey: Option.match(représentantLégal)
              .some(
                (représentantLégal) =>
                  représentantLégal.demande?.pièceJustificative.formatter() ?? '',
              )
              .none(() => ''),
          },
        });

        const actualContent = await convertReadableStreamToString(result.content);
        console.log(actualContent);

        console.log(
          this.lauréatWorld.représentantLégalWorld.demanderChangementReprésentantLégalFixture,
        );

        const expectedContent = await convertReadableStreamToString(
          this.lauréatWorld.représentantLégalWorld.demanderChangementReprésentantLégalFixture
            .pièceJustificative.content ?? new ReadableStream(),
        );
        expect(actualContent).to.be.equal(expectedContent);
      }
    });
  },
);
