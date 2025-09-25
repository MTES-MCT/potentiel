import { Then as Alors } from '@cucumber/cucumber';
import { expect } from 'chai';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PotentielWorld } from '../../../../../potentiel.world';
import { expectFileContent } from '../../../../../helpers/expectFileContent';

Alors(
  'le dépôt de garanties financières devrait être consultable pour le projet lauréat',
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    await waitForExpect(async () => {
      const actualReadModel = await getDépôtEnCoursGarantiesFinancières(identifiantProjet);

      const actual = mapToPlainObject(actualReadModel);

      const expected = mapToPlainObject(
        this.lauréatWorld.garantiesFinancièresWorld.dépôt.mapToExpected(),
      );

      actual.should.be.deep.equal(expected);

      if (actualReadModel.document) {
        await expectFileContent(
          actualReadModel.document,
          this.lauréatWorld.garantiesFinancièresWorld.dépôt.mapToAttestation(),
        );
      }
    });
  },
);

Alors(
  'il ne devrait pas y avoir de dépôt de garanties financières pour le projet',
  async function (this: PotentielWorld) {
    await waitForExpect(async () => {
      const détailDépôt =
        await mediator.send<Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterDépôtGarantiesFinancières',
          data: {
            identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
          },
        });
      expect(Option.isNone(détailDépôt)).to.be.true;

      const listeDépôts =
        await mediator.send<Lauréat.GarantiesFinancières.ListerDépôtsGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ListerDépôtsGarantiesFinancières',
          data: {
            identifiantUtilisateur: 'admin@test.test',
          },
        });

      expect(listeDépôts.items).to.be.empty;
    });
  },
);

const getDépôtEnCoursGarantiesFinancières = async (
  identifiantProjet: IdentifiantProjet.ValueType,
) => {
  const actualReadModel =
    await mediator.send<Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresQuery>({
      type: 'Lauréat.GarantiesFinancières.Query.ConsulterDépôtGarantiesFinancières',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
      },
    });

  if (Option.isNone(actualReadModel)) {
    throw new Error(
      `Le read model du dépôt en cours de garanties financières du projet ${identifiantProjet.formatter()} n'existe pas`,
    );
  }

  return actualReadModel;
};
