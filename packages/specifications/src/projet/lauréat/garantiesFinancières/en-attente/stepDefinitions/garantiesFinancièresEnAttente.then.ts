import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { PotentielWorld } from '../../../../../potentiel.world';

Alors(
  `des garanties financières devraient être attendues pour le projet lauréat avec :`,
  async function (this: PotentielWorld, dataTable: DataTable) {
    const { identifiantProjet } = this.lauréatWorld;

    const exemple = dataTable.rowsHash();
    const dateLimiteSoumission = exemple['date limite de soumission'];
    const motif = exemple['motif'];

    const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: {
        identifiantAppelOffre: identifiantProjet.appelOffre,
      },
    });

    if (
      Option.isSome(appelOffre) &&
      GarantiesFinancières.appelOffreSoumisAuxGarantiesFinancières({
        appelOffre,
        période: identifiantProjet.période,
        famille: identifiantProjet.famille,
      })
    ) {
      await waitForExpect(async () => {
        const actualReadModel = await getProjetAvecGarantiesFinancièresEnAttente(identifiantProjet);
        expect(actualReadModel.motif.motif).to.deep.equal(motif);

        if (dateLimiteSoumission) {
          expect(actualReadModel.dateLimiteSoumission.date).to.deep.equal(
            new Date(dateLimiteSoumission),
          );
        }
      });
    }
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
