import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { assert, expect } from 'chai';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { waitForExpect } from '#helpers';

import { PotentielWorld } from '../../../../../potentiel.world.js';
import { expectFileContent } from '../../../../../helpers/expectFileContent.js';

Alors(
  'les garanties financières actuelles devraient être consultables pour le projet lauréat',
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    await waitForExpect(async () => {
      const actualReadModel =
        await mediator.send<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });

      assert(Option.isSome(actualReadModel), 'Pas de garanties financières actuelles trouvées');

      const actual = mapToPlainObject(actualReadModel);

      const expected = mapToPlainObject(
        this.lauréatWorld.garantiesFinancièresWorld.mapToExpected(),
      );

      actual.should.be.deep.equal(expected);

      if (actualReadModel.document) {
        await expectFileContent(
          actualReadModel.document,
          this.lauréatWorld.garantiesFinancièresWorld.mapToAttestation(),
        );
      }
    });
  },
);

Alors(
  `les garanties financières actuelles ne devraient pas être consultables pour le projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    await waitForExpect(async () => {
      const garantiesFinancièresActuelles =
        await mediator.send<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });
      expect(Option.isNone(garantiesFinancièresActuelles)).to.be.true;
    });
  },
);

Alors(
  `un historique des garanties financières devrait être consultable pour le projet lauréat avec :`,
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const { identifiantProjet } = this.lauréatWorld;

    const { garantiesFinancières: expectedGf } =
      this.lauréatWorld.garantiesFinancièresWorld.actuelles.mapToExpected();

    const raisonValue = exemple['raison'];
    const expectedAttestation =
      this.lauréatWorld.garantiesFinancièresWorld.actuelles.mapToAttestation();

    await waitForExpect(async () => {
      const archives =
        await mediator.send<Lauréat.GarantiesFinancières.ListerArchivesGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ListerArchivesGarantiesFinancières',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });

      expect(archives).to.have.length(1);
      const actualArchive = archives[0];

      const actualGf = mapToPlainObject(actualArchive.garantiesFinancières);
      expect(actualGf).to.deep.equal(mapToPlainObject(expectedGf));

      const actualMotif = mapToPlainObject(actualArchive.motif);
      const expectedMotif = mapToPlainObject(
        Lauréat.GarantiesFinancières.MotifArchivageGarantiesFinancières.convertirEnValueType(
          raisonValue,
        ),
      );
      expect(actualMotif).to.deep.eq(expectedMotif);

      if (actualArchive.document) {
        await expectFileContent(actualArchive.document, expectedAttestation);
      }
    });
  },
);

Alors(
  `les garanties financières actuelles du projet sont échues`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    await waitForExpect(async () => {
      const actualReadModel =
        await mediator.send<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });

      expect(Option.isSome(actualReadModel)).to.be.true;
      assert(Option.isSome(actualReadModel));
      expect(actualReadModel.statut.estÉchu()).to.be.true;
    });
  },
);
