import { Then as Alors } from '@cucumber/cucumber';
import { assert, expect } from 'chai';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';

import { Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';

import { PotentielWorld } from '../../../../../potentiel.world';
import { expectFileContent } from '../../../../../helpers/expectFileContent';

Alors(
  `une demande de mainlevée de garanties financières devrait être consultable`,
  async function (this: PotentielWorld) {
    const expected = mapToPlainObject(
      this.lauréatWorld.garantiesFinancièresWorld.mainlevée.mapToExpected(),
    );
    const { identifiantProjet } = this.lauréatWorld;
    const actualReadModel =
      await mediator.send<Lauréat.GarantiesFinancières.ConsulterMainlevéeEnCoursQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterMainlevéeEnCours',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

    assert(Option.isSome(actualReadModel));
    const actual = mapToPlainObject(actualReadModel);

    expect(actual).to.deep.equal(
      expected,
      'Le modèle retourné ne correspond pas au modèle attendu',
    );

    if (actualReadModel.accord) {
      await expectFileContent(
        actualReadModel.accord.courrierAccord,
        this.lauréatWorld.garantiesFinancièresWorld.mainlevée.accorder.courrierAccord,
      );
    }
  },
);

Alors(
  `une demande de mainlevée de garanties financières ne devrait plus être consultable`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    await waitForExpect(async () => {
      const actualReadModel =
        await mediator.send<Lauréat.GarantiesFinancières.ConsulterMainlevéeEnCoursQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterMainlevéeEnCours',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

      expect(Option.isNone(actualReadModel));
    });
  },
);

Alors(
  `une demande de mainlevée de garanties financières devrait être consultable dans l'historique des mainlevées rejetées`,
  async function (this: PotentielWorld) {
    assert(false, 'A REVOIR !');
    // const { identifiantProjet } = this.lauréatWorld;
    // await waitForExpect(async () => {
    //   const actualReadModelList =
    //     await mediator.send<Lauréat.GarantiesFinancières.ListerMainlevéesQuery>({
    //       type: 'Lauréat.GarantiesFinancières.Mainlevée.Query.Lister',
    //       data: {
    //         identifiantProjet: identifiantProjet.formatter(),
    //         statut: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.rejeté.statut,
    //       },
    //     });
    //   expect(actualReadModelList.items).to.be.length(1);
    //   const actualReadModel = actualReadModelList.items[0];
    //   const actual = mapToPlainObject(actualReadModel);
    //   const expected = mapToPlainObject(
    //     this.lauréatWorld.garantiesFinancièresWorld.mainlevée.mapToExpected().items[0],
    //   );

    //   expect(actual).to.deep.equal(expected);

    //   assert(actualReadModel.rejet);
    //   await expectFileContent(
    //     actualReadModel.rejet.courrierRejet,
    //     this.lauréatWorld.garantiesFinancièresWorld.mainlevée.rejeter.courrierRejet,
    //   );
    // });
  },
);
