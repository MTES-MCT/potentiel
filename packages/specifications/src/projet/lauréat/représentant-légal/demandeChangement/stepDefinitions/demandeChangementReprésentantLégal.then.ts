import { Then as Alors } from '@cucumber/cucumber';
import waitForExpect from 'wait-for-expect';
import { mediator } from 'mediateur';

import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PotentielWorld } from '../../../../../potentiel.world';

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

      // if (
      //   Option.isSome(représentantLégal) &&
      //   représentantLégal.demande &&
      //   this.lauréatWorld.représentantLégalWorld.demanderChangementReprésentantLégalFixture.aÉtéCréé
      // ) {
      //   for (const existingPj of représentantLégal.demande.piècesJustificatives) {
      //     for (const fixturePj of this.lauréatWorld.représentantLégalWorld
      //       .demanderChangementReprésentantLégalFixture.piècesJustificatives) {
      //       const result = await mediator.send<ConsulterDocumentProjetQuery>({
      //         type: 'Document.Query.ConsulterDocumentProjet',
      //         data: {
      //           documentKey: existingPj.formatter(),
      //         },
      //       });

      //       const actualContent = await convertReadableStreamToString(result.content);
      //       const expectedContent = await convertReadableStreamToString(
      //         fixturePj.content ?? new ReadableStream(),
      //       );
      //       expect(actualContent).to.be.equal(expectedContent);
      //     }
      //   }
      // }
    });
  },
);
