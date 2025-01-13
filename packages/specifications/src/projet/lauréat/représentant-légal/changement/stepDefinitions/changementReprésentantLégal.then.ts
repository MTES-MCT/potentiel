import { Then as Alors } from '@cucumber/cucumber';
import waitForExpect from 'wait-for-expect';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { PotentielWorld } from '../../../../../potentiel.world';
import { convertReadableStreamToString } from '../../../../../helpers/convertReadableToString';

Alors(
  /une demande de changement de représentant légal du projet lauréat devrait être consultable/,
  async function (this: PotentielWorld) {
    await waitForExpect(async () => {
      const { identifiantProjet } = this.lauréatWorld;

      const demande =
        await mediator.send<ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
          type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

      const actual = mapToPlainObject(demande);
      const expected = mapToPlainObject(
        this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.mapToExpected(
          identifiantProjet,
        ),
      );

      actual.should.be.deep.equal(expected);

      if (
        this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld
          .demanderChangementReprésentantLégalFixture.aÉtéCréé
      ) {
        const result = await mediator.send<ConsulterDocumentProjetQuery>({
          type: 'Document.Query.ConsulterDocumentProjet',
          data: {
            documentKey: Option.match(demande)
              .some(({ demande }) => {
                return demande.pièceJustificative.formatter() ?? '';
              })
              .none(() => ''),
          },
        });

        const actualContent = await convertReadableStreamToString(result.content);

        const expectedContent = await convertReadableStreamToString(
          this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld
            .demanderChangementReprésentantLégalFixture.pièceJustificative?.content ??
            new ReadableStream(),
        );

        actualContent.should.be.equal(expectedContent);
      }
    });
  },
);

Alors(
  /la demande de changement de représentant légal du projet lauréat devrait être accordée/,
  async function (this: PotentielWorld) {
    await waitForExpect(async () => {
      const { identifiantProjet } = this.lauréatWorld;

      const changement =
        await mediator.send<ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
          type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

      const actual = mapToPlainObject(changement);
      const expected = mapToPlainObject(
        this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.mapToExpected(
          identifiantProjet,
          ReprésentantLégal.StatutChangementReprésentantLégal.accordé,
        ),
      );

      actual.should.be.deep.equal(expected);
    });
  },
);

Alors(
  /la demande de changement de représentant légal du projet lauréat devrait être rejetée/,
  async function (this: PotentielWorld) {
    await waitForExpect(async () => {
      const { identifiantProjet } = this.lauréatWorld;

      const changement =
        await mediator.send<ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
          type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

      const actual = mapToPlainObject(changement);
      const expected = mapToPlainObject(
        this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.mapToExpected(
          identifiantProjet,
          ReprésentantLégal.StatutChangementReprésentantLégal.rejeté,
        ),
      );

      actual.should.be.deep.equal(expected);
    });
  },
);

Alors(
  `le représentant légal du projet lauréat( ne) devrait( pas) être mis à jour`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () => {
      const { identifiantProjet } = this.lauréatWorld;

      const représentantLégal =
        await mediator.send<ReprésentantLégal.ConsulterReprésentantLégalQuery>({
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
    });
  },
);

Alors(
  /la demande de changement de représentant légal du projet lauréat ne devrait plus être consultable/,
  async function (this: PotentielWorld) {
    await waitForExpect(async () => {
      const { identifiantProjet } = this.lauréatWorld;

      const changement =
        await mediator.send<ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
          type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

      Option.isNone(changement).should.be.true;
    });
  },
);
