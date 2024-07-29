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
import { getDépôtGarantiesFinancièresData } from '../../helpers';
import { sleep } from '../../../../../helpers/sleep';

Alors(
  'le dépôt de garanties financières devrait être consultable pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const {
      typeValue,
      dateÉchéanceValue,
      dateConstitutionValue,
      attestationValue,
      soumisLeValue,
      dernièreMiseÀJour,
    } = getDépôtGarantiesFinancièresData(identifiantProjet, exemple);

    // ASSERT ON READ MODEL
    await waitForExpect(async () => {
      const actualReadModel = await getDépôtEnCoursGarantiesFinancières(identifiantProjet);

      const dépôtEnCours = actualReadModel.dépôt;

      expect(dépôtEnCours).not.to.be.undefined;
      assert(dépôtEnCours);

      expect(dépôtEnCours.type.type).to.deep.equal(typeValue);
      expect(dépôtEnCours.dateConstitution.date).to.deep.equal(new Date(dateConstitutionValue));
      expect(dépôtEnCours.soumisLe.date).to.deep.equal(new Date(soumisLeValue));
      expect(dépôtEnCours.dernièreMiseÀJour.date.date).to.deep.equal(
        new Date(dernièreMiseÀJour.date),
      );
      expect(dépôtEnCours.dernièreMiseÀJour.par.formatter()).to.deep.equal(dernièreMiseÀJour.par);

      if (dépôtEnCours.dateÉchéance && dateÉchéanceValue) {
        expect(dépôtEnCours.dateÉchéance).not.to.be.undefined;
        expect(dépôtEnCours.dateÉchéance.date).to.deep.equal(new Date(dateÉchéanceValue!));
      }

      // ASSERT ON FILE
      expect(dépôtEnCours.attestation).not.to.be.undefined;
      expect(dépôtEnCours.attestation.format).to.deep.equal(attestationValue.format);

      const file = await mediator.send<ConsulterDocumentProjetQuery>({
        type: 'Document.Query.ConsulterDocumentProjet',
        data: {
          documentKey: dépôtEnCours.attestation.formatter(),
        },
      });

      const actualContent = await convertReadableStreamToString(file.content);
      actualContent.should.be.equal(attestationValue.content);
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

      await sleep(100);

      const listeDépôts =
        await mediator.send<GarantiesFinancières.ListerDépôtsEnCoursGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ListerDépôtsEnCoursGarantiesFinancières',
          data: {
            utilisateur: {
              rôle: 'admin',
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

  console.log('actualReadModel 👨🏼‍🦱', actualReadModel);

  if (Option.isNone(actualReadModel)) {
    throw new Error(
      `Le read model du dépôt en cours de garanties financières du projet ${identifiantProjet.formatter()} n'existe pas`,
    );
  }

  return actualReadModel;
};
