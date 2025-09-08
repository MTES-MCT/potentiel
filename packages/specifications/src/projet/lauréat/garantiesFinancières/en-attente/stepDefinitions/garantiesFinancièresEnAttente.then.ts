import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../../potentiel.world';

Alors(
  `des garanties financières devraient être attendues pour le projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    const { dateLimiteSoumission, motif } =
      this.lauréatWorld.garantiesFinancièresWorld.actuelles.demander;

    await vérifierGarantiesFinancièresAttendues.call(
      this,
      identifiantProjet,
      motif,
      dateLimiteSoumission,
    );
  },
);

Alors(
  `des garanties financières devraient être attendues pour le projet lauréat avec :`,
  async function (this: PotentielWorld, dataTable: DataTable) {
    const { identifiantProjet } = this.lauréatWorld;

    const exemple = dataTable.rowsHash();
    const dateLimiteSoumission = exemple['date limite de soumission'];
    const motif = exemple['motif'];
    await vérifierGarantiesFinancièresAttendues.call(
      this,
      identifiantProjet,
      motif,
      dateLimiteSoumission,
    );
  },
);

Alors(
  `les garanties financières en attente du projet ne devraient plus être consultables`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
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

async function vérifierGarantiesFinancièresAttendues(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  motif: string,
  dateLimiteSoumission?: string,
) {
  await waitForExpect(async () => {
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
    expect(actualReadModel.motif.motif).to.deep.equal(motif);

    if (dateLimiteSoumission) {
      expect(actualReadModel.dateLimiteSoumission.date).to.deep.equal(
        new Date(dateLimiteSoumission),
      );
    }
  });
}
