import { Then as Alors } from '@cucumber/cucumber';
import waitForExpect from 'wait-for-expect';
import { mediator } from 'mediateur';
import { assert } from 'chai';

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
            identifiantChangement:
              this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld
                .demanderChangementReprésentantLégalFixture.identifiantChangement,
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
  /la demande de changement de représentant légal du projet lauréat ne devrait plus être consultable/,
  async function (this: PotentielWorld) {
    await waitForExpect(async () => {
      const changement =
        await mediator.send<ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
          type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
          data: {
            identifiantChangement:
              this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld
                .demanderChangementReprésentantLégalFixture.identifiantChangement,
          },
        });

      Option.isNone(changement).should.be.true;
    });
  },
);

Alors(
  'la demande de changement de représentant légal du projet lauréat devrait être accordée',
  async function (this: PotentielWorld) {
    await vérifierInstructionDemande.bind(
      this,
      ReprésentantLégal.StatutChangementReprésentantLégal.accordé,
    );
  },
);

Alors(
  'la demande de changement de représentant légal du projet lauréat devrait être rejetée',
  async function (this: PotentielWorld) {
    await vérifierInstructionDemande.bind(
      this,
      ReprésentantLégal.StatutChangementReprésentantLégal.rejeté,
    );
  },
);

Alors(
  'la demande de changement de représentant légal du projet lauréat devrait être rejetée automatiquement',
  async function (this: PotentielWorld) {
    await vérifierInstructionAutomatiqueDemande.bind(this, 'rejet');
  },
);

Alors(
  'la demande de changement de représentant légal du projet lauréat devrait être accordée automatiquement',
  async function (this: PotentielWorld) {
    await vérifierInstructionAutomatiqueDemande.bind(this, 'rejet');
  },
);

async function vérifierInstructionDemande(
  this: PotentielWorld,
  statut: ReprésentantLégal.StatutChangementReprésentantLégal.ValueType,
) {
  await waitForExpect(async () => {
    const { identifiantProjet } = this.lauréatWorld;

    const changement =
      await mediator.send<ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
        type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
        data: {
          identifiantChangement:
            this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld
              .demanderChangementReprésentantLégalFixture.identifiantChangement,
        },
      });

    const actual = mapToPlainObject(changement);
    const expected = mapToPlainObject(
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.mapToExpected(
        identifiantProjet,
        statut,
      ),
    );

    actual.should.be.deep.equal(expected);
  });
}

async function vérifierInstructionAutomatiqueDemande(
  this: PotentielWorld,
  action: 'accord' | 'rejet',
) {
  return waitForExpect(async () => {
    const { identifiantProjet } = this.lauréatWorld;

    const changement =
      await mediator.send<ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
        type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
        data: {
          identifiantChangement:
            this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld
              .demanderChangementReprésentantLégalFixture.identifiantChangement,
        },
      });

    assert(Option.isSome(changement), 'Aucune demande de changement de représentant légal trouvée');

    const statut =
      action === 'accord'
        ? ReprésentantLégal.StatutChangementReprésentantLégal.accordé
        : ReprésentantLégal.StatutChangementReprésentantLégal.rejeté;

    const actual = mapToPlainObject(changement);
    const expected = mapToPlainObject(
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.mapToExpected(
        identifiantProjet,
        statut,
      ),
    );

    actual.demande.statut.should.be.deep.equal(expected.demande.statut);

    if (action === 'accord') {
      actual.demande.accord?.accordéPar.should.be.deep.equal(expected.demande.accord?.accordéPar);
    } else {
      actual.demande.rejet?.motif.should.be.equal(expected.demande.rejet?.motif);
      actual.demande.rejet?.rejetéPar.should.be.deep.equal(expected.demande.rejet?.rejetéPar);
    }
  });
}
