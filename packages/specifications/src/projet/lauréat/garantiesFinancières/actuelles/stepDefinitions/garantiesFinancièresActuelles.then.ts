import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { assert, expect } from 'chai';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';

import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { convertReadableStreamToString } from '../../../../../helpers/convertReadableToString';
import { PotentielWorld } from '../../../../../potentiel.world';
import { getGarantiesFinancièresActuellesData } from '../../helpers';

Alors(
  `les garanties financières actuelles devraient être consultables pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const { typeValue, dateÉchéanceValue, attestationValue, dateConstitutionValue } =
      getGarantiesFinancièresActuellesData(identifiantProjet, exemple);

    const dateValidation = exemple['date de validation'];
    const dateMiseÀJour = exemple['date dernière mise à jour'];

    // ASSERT ON READ MODEL
    await waitForExpect(async () => {
      const actualReadModel = await getGarantiesFinancières(identifiantProjet);

      expect(actualReadModel.garantiesFinancières).not.to.be.undefined;
      assert(actualReadModel.garantiesFinancières);

      expect(actualReadModel.garantiesFinancières.type.type).to.deep.equal(typeValue);

      if (dateÉchéanceValue) {
        expect(actualReadModel.garantiesFinancières.dateÉchéance?.date).to.deep.equal(
          new Date(dateÉchéanceValue),
        );
      }
      expect(actualReadModel.garantiesFinancières.dateConstitution?.date).to.deep.equal(
        new Date(dateConstitutionValue),
      );
      expect(actualReadModel.garantiesFinancières.dernièreMiseÀJour.date.date).to.deep.equal(
        new Date(dateMiseÀJour),
      );
      if (dateValidation) {
        expect(actualReadModel.garantiesFinancières.validéLe?.date).to.deep.equal(
          new Date(dateValidation),
        );
      }

      expect(actualReadModel.garantiesFinancières.statut.estValidé()).to.be.true;

      // ASSERT ON FILE

      if (attestationValue) {
        expect(actualReadModel.garantiesFinancières.attestation).not.to.be.undefined;
        assert(actualReadModel.garantiesFinancières.attestation);

        const file = await mediator.send<ConsulterDocumentProjetQuery>({
          type: 'Document.Query.ConsulterDocumentProjet',
          data: {
            documentKey: actualReadModel.garantiesFinancières.attestation.formatter(),
          },
        });

        expect(actualReadModel.garantiesFinancières.attestation.format).to.be.equal(
          attestationValue.format,
        );
        const actualContent = await convertReadableStreamToString(file.content);
        actualContent.should.be.equal(attestationValue.content);
      }
    });
  },
);

Alors(
  `il ne devrait pas y avoir de garanties financières actuelles pour le projet {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const garantiesFinancièresActuelles =
        await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
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
  `les garanties financières actuelles du projet {string} sont échues`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const actualReadModel =
        await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });

      expect(Option.isSome(actualReadModel)).to.be.true;
      assert(Option.isSome(actualReadModel));
      expect(actualReadModel.garantiesFinancières.statut.estÉchu()).to.be.true;
    });
  },
);

const getGarantiesFinancières = async (identifiantProjet: IdentifiantProjet.ValueType) => {
  const actualReadModel =
    await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
      type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
      },
    });

  if (Option.isNone(actualReadModel)) {
    throw new Error(
      `Le read model des garanties financières du projet ${identifiantProjet.formatter()} n'existe pas`,
    );
  }

  return actualReadModel;
};
