import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { assert, expect } from 'chai';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';

import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { convertReadableStreamToString } from '../../../../../helpers/convertReadableToString';
import { PotentielWorld } from '../../../../../potentiel.world';

Alors(
  'les garanties financières actuelles devraient être consultables pour le projet lauréat',
  async function (this: PotentielWorld) {
    await waitForExpect(async () => {
      const actualReadModel = await getGarantiesFinancières(this.lauréatWorld.identifiantProjet);

      const actual = mapToPlainObject(actualReadModel);

      const expected = mapToPlainObject(
        this.lauréatWorld.garantiesFinancièresWorld.mapToExpected(),
      );

      actual.should.be.deep.equal(expected);

      if (actualReadModel.garantiesFinancières.attestation) {
        const file = await mediator.send<ConsulterDocumentProjetQuery>({
          type: 'Document.Query.ConsulterDocumentProjet',
          data: {
            documentKey: actualReadModel.garantiesFinancières.attestation.formatter(),
          },
        });

        assert(Option.isSome(file), `Attestation non trouvée !`);
        const expectedAttestation = this.lauréatWorld.garantiesFinancièresWorld.mapToAttestation();

        expect(actualReadModel.garantiesFinancières.attestation.format).to.be.equal(
          expectedAttestation.format,
        );
        const actualContent = await convertReadableStreamToString(file.content);
        expect(actualContent).to.equal(expectedAttestation.content);
      }
    });
  },
);

Alors(
  'les garanties financières actuelles devraient être consultables pour le projet {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    const { values } = this.candidatureWorld.importerCandidature;

    await waitForExpect(async () => {
      if (values.typeGarantiesFinancièresValue) {
        const actualReadModel = await getGarantiesFinancières(identifiantProjet);
        assert(actualReadModel.garantiesFinancières);
        expect(actualReadModel.garantiesFinancières.type.type).to.deep.equal(
          values.typeGarantiesFinancièresValue,
        );

        if (values.dateÉchéanceGfValue) {
          expect(actualReadModel.garantiesFinancières.dateÉchéance?.date).to.deep.equal(
            new Date(values.dateÉchéanceGfValue),
          );
        }
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

    const { garantiesFinancières } =
      this.lauréatWorld.garantiesFinancièresWorld.actuelles.mapToExpected();

    const typeValue = garantiesFinancières.type.formatter();
    const dateÉchéanceValue = garantiesFinancières.dateÉchéance?.formatter();
    const dateConstitutionValue = garantiesFinancières.dateConstitution?.formatter();
    const validéLeValue = garantiesFinancières.validéLe?.formatter();
    const statutValue = garantiesFinancières.statut.statut;

    const { format, content } =
      this.lauréatWorld.garantiesFinancièresWorld.actuelles.mapToAttestation();

    const raisonValue = exemple['raison'];

    await waitForExpect(async () => {
      const actualArchivesGarantiesFinancièresReadModel =
        await mediator.send<GarantiesFinancières.ConsulterArchivesGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterArchivesGarantiesFinancières',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });

      assert(Option.isSome(actualArchivesGarantiesFinancièresReadModel));

      actualArchivesGarantiesFinancièresReadModel.archives.should.length(1);

      expect(actualArchivesGarantiesFinancièresReadModel.archives[0].type.type).to.deep.equal(
        typeValue,
      );

      if (dateÉchéanceValue) {
        expect(
          actualArchivesGarantiesFinancièresReadModel.archives[0].dateÉchéance?.date,
        ).to.deep.equal(new Date(dateÉchéanceValue));
      }

      if (dateConstitutionValue) {
        expect(
          actualArchivesGarantiesFinancièresReadModel.archives[0].dateConstitution?.date,
        ).to.deep.equal(new Date(dateConstitutionValue));
      }

      if (validéLeValue) {
        expect(
          actualArchivesGarantiesFinancièresReadModel.archives[0].validéLe?.date,
        ).to.deep.equal(new Date(validéLeValue));
      }

      expect(actualArchivesGarantiesFinancièresReadModel.archives[0].statut.statut).to.be.equal(
        statutValue,
      );

      expect(
        actualArchivesGarantiesFinancièresReadModel.archives[0].motif.estÉgaleÀ(
          GarantiesFinancières.MotifArchivageGarantiesFinancières.convertirEnValueType(raisonValue),
        ),
      ).to.be.true;

      if (format && content) {
        expect(actualArchivesGarantiesFinancièresReadModel.archives[0].attestation).not.to.be
          .undefined;
        assert(actualArchivesGarantiesFinancièresReadModel.archives[0].attestation);

        const file = await mediator.send<ConsulterDocumentProjetQuery>({
          type: 'Document.Query.ConsulterDocumentProjet',
          data: {
            documentKey:
              actualArchivesGarantiesFinancièresReadModel.archives[0].attestation.formatter(),
          },
        });

        assert(Option.isSome(file), `Attestation non trouvée !`);

        expect(
          actualArchivesGarantiesFinancièresReadModel.archives[0].attestation.format,
        ).to.be.equal(format);
        const actualContent = await convertReadableStreamToString(file.content);
        actualContent.should.be.equal(content);
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
      expect(actualReadModel.garantiesFinancières.statut.estÉchu()).to.be.true;
    });
  },
);

const getGarantiesFinancières = async (identifiantProjet: IdentifiantProjet.ValueType) => {
  const actualReadModel =
    await mediator.send<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
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
