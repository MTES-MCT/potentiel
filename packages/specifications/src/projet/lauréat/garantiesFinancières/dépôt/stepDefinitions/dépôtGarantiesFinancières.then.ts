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

Alors(
  'le dépôt de garanties financières devrait être consultable pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const typeGarantiesFinancières = exemple['type'];
    const dateÉchéance = exemple[`date d'échéance`];
    const format = exemple['format'];
    const dateConstitution = exemple[`date de constitution`];
    const contenu = exemple['contenu fichier'];
    const dateSoumission = exemple['date de soumission'];
    const soumisPar = exemple['soumis par'];
    const dateMiseÀJour = exemple['date de dernière mise à jour'];

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    // ASSERT ON READ MODEL
    await waitForExpect(async () => {
      const actualReadModel = await getDépôtEnCoursGarantiesFinancières(identifiantProjet);

      const dépôtEnCours = actualReadModel.dépôt;

      expect(dépôtEnCours).not.to.be.undefined;
      assert(dépôtEnCours);

      expect(dépôtEnCours.type.type).to.deep.equal(typeGarantiesFinancières);
      expect(dépôtEnCours.dateConstitution.date).to.deep.equal(new Date(dateConstitution));
      expect(dépôtEnCours.soumisLe.date).to.deep.equal(new Date(dateSoumission));
      expect(dépôtEnCours.dernièreMiseÀJour.date.date).to.deep.equal(new Date(dateMiseÀJour));
      expect(dépôtEnCours.dernièreMiseÀJour.par.formatter()).to.deep.equal(soumisPar);

      if (dépôtEnCours.dateÉchéance) {
        expect(dépôtEnCours.dateÉchéance.date).to.deep.equal(new Date(dateÉchéance));
      }

      // ASSERT ON FILE
      expect(dépôtEnCours.attestation).not.to.be.undefined;
      expect(dépôtEnCours.attestation.format).to.deep.equal(format);

      if (dépôtEnCours?.attestation) {
        const file = await mediator.send<ConsulterDocumentProjetQuery>({
          type: 'Document.Query.ConsulterDocumentProjet',
          data: {
            documentKey: dépôtEnCours.attestation.formatter(),
          },
        });

        const actualContent = await convertReadableStreamToString(file.content);
        actualContent.should.be.equal(contenu);
      }
    });
  },
);

Alors(
  'il ne devrait pas y avoir de dépôt de garanties financières pour le projet {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const détailDépôt =
        await mediator.send<GarantiesFinancières.ConsulterDépôtEnCoursGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterDépôtEnCoursGarantiesFinancières',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });
      expect(Option.isNone(détailDépôt)).to.be.true;

      const listeDépôts =
        await mediator.send<GarantiesFinancières.ListerDépôtsEnCoursGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ListerDépôtsEnCoursGarantiesFinancières',
          data: {
            utilisateur: {
              rôle: 'admin',
              identifiantUtilisateur: 'admin@test.test',
            },
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
    await mediator.send<GarantiesFinancières.ConsulterDépôtEnCoursGarantiesFinancièresQuery>({
      type: 'Lauréat.GarantiesFinancières.Query.ConsulterDépôtEnCoursGarantiesFinancières',
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
