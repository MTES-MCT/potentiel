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

import { setGarantiesFinancièresData } from './helper';

Alors(
  'les garanties financières actuelles devraient être consultables pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const typeGarantiesFinancières = exemple['type'];
    const dateÉchéance = exemple[`date d'échéance`];
    const format = exemple['format'];
    const dateConstitution = exemple[`date de constitution`];
    const contenu = exemple['contenu fichier'];
    const dateValidation = exemple['date de validation'];
    const dateMiseÀJour = exemple['date dernière mise à jour'];

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const actualReadModel = await getGarantiesFinancières(identifiantProjet);

      expect(actualReadModel.garantiesFinancières).not.to.be.undefined;
      assert(actualReadModel.garantiesFinancières);

      expect(actualReadModel.garantiesFinancières.type.type).to.deep.equal(
        typeGarantiesFinancières,
      );

      if (dateÉchéance) {
        expect(actualReadModel.garantiesFinancières.dateÉchéance?.date).to.deep.equal(
          new Date(dateÉchéance),
        );
      }
      if (dateConstitution) {
        expect(actualReadModel.garantiesFinancières.dateConstitution?.date).to.deep.equal(
          new Date(dateConstitution),
        );
      }
      if (dateMiseÀJour) {
        expect(actualReadModel.garantiesFinancières.dernièreMiseÀJour.date.date).to.deep.equal(
          new Date(dateMiseÀJour),
        );
      }
      if (dateValidation) {
        expect(actualReadModel.garantiesFinancières.validéLe?.date).to.deep.equal(
          new Date(dateValidation),
        );
      }

      expect(actualReadModel.garantiesFinancières.statut.estValidé()).to.be.true;

      if (format && contenu) {
        expect(actualReadModel.garantiesFinancières.attestation).not.to.be.undefined;
        assert(actualReadModel.garantiesFinancières.attestation);

        const file = await mediator.send<ConsulterDocumentProjetQuery>({
          type: 'Document.Query.ConsulterDocumentProjet',
          data: {
            documentKey: actualReadModel.garantiesFinancières.attestation.formatter(),
          },
        });

        expect(actualReadModel.garantiesFinancières.attestation.format).to.be.equal(format);
        const actualContent = await convertReadableStreamToString(file.content);
        actualContent.should.be.equal(contenu);
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
  `un historique des garanties financières devrait être consultable pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    const {
      typeValue,
      dateÉchéanceValue,
      attestationValue: { format, content },
      dateConstitutionValue,
      validéLeValue,
      statutValue,
    } = setGarantiesFinancièresData({
      identifiantProjet,
      exemple,
    });

    const raisonValue = exemple['raison'];

    await waitForExpect(async () => {
      const actualArchivesGarantiesFinancièresReadModel =
        await mediator.send<GarantiesFinancières.ConsulterArchivesGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterArchivesGarantiesFinancières',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });

      expect(Option.isSome(actualArchivesGarantiesFinancièresReadModel)).to.be.true;

      if (Option.isSome(actualArchivesGarantiesFinancièresReadModel)) {
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
            GarantiesFinancières.MotifArchivageGarantiesFinancières.convertirEnValueType(
              raisonValue,
            ),
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

          expect(
            actualArchivesGarantiesFinancièresReadModel.archives[0].attestation.format,
          ).to.be.equal(format);
          const actualContent = await convertReadableStreamToString(file.content);
          const expectedContent = await convertReadableStreamToString(content);
          actualContent.should.be.equal(expectedContent);
        }
      }
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
