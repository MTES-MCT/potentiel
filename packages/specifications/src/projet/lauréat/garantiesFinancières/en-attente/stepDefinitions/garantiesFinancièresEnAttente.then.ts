import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../../../potentiel.world';

Alors(
  `des garanties financières devraient être attendues pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const exemple = dataTable.rowsHash();
    const dateLimiteSoumission = exemple['date limite de soumission'];
    const motif = exemple['motif'];

    await waitForExpect(async () => {
      const actualReadModel = await getProjetAvecGarantiesFinancièresEnAttente(identifiantProjet);
      console.log(actualReadModel);

      expect(actualReadModel.nomProjet).to.deep.equal(nomProjet);
      expect(actualReadModel.motif.motif).to.deep.equal(motif);
      expect(actualReadModel.dateLimiteSoumission.date).to.deep.equal(
        new Date(dateLimiteSoumission),
      );
    });
  },
);

Alors(
  `les garanties financières en attente du projet {string} ne devraient plus être consultables`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    await waitForExpect(async () => {
      const result =
        await mediator.send<GarantiesFinancières.ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery>(
          {
            type: 'Lauréat.GarantiesFinancières.Query.ConsulterProjetAvecGarantiesFinancièresEnAttente',
            data: {
              identifiantProjetValue: identifiantProjet.formatter(),
            },
          },
        );

      expect(Option.isNone(result)).to.be.true;
    });
  },
);

const getProjetAvecGarantiesFinancièresEnAttente = async (
  identifiantProjet: IdentifiantProjet.ValueType,
) => {
  const actualReadModel =
    await mediator.send<GarantiesFinancières.ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery>(
      {
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterProjetAvecGarantiesFinancièresEnAttente',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      },
    );

  if (Option.isNone(actualReadModel)) {
    throw new Error(
      `Le read model des garanties financières en attente pour le projet ${identifiantProjet.formatter()} n'existe pas`,
    );
  }

  return actualReadModel;
};
