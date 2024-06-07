import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { PotentielWorld } from '../../../../potentiel.world';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { Email } from '@potentiel-domain/common';

Alors(
  `une demande de main-levée de garanties financières devrait être consultable pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const motif = exemple['motif'] || 'projet-abandonné';
    const utilisateur = exemple['utilisateur'] || 'user@test.test';
    const dateDemande = exemple['date demande'] || '2024-01-01';

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const actualReadModel =
        await mediator.send<GarantiesFinancières.ConsulterMainLevéeGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.MainLevée.Query.Consulter',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });

      expect(Option.isSome(actualReadModel)).to.be.true;

      if (Option.isSome(actualReadModel)) {
        expect(
          actualReadModel.motif.estÉgaleÀ(
            GarantiesFinancières.MotifDemandeMainLevéeGarantiesFinancières.convertirEnValueType(
              motif,
            ),
          ),
        ).to.be.true;

        expect(
          actualReadModel.demande.demandéePar.estÉgaleÀ(Email.convertirEnValueType(utilisateur)),
        ).to.be.true;

        expect(actualReadModel.demande.demandéeLe.date).to.deep.equal(new Date(dateDemande));

        expect(actualReadModel.statut.estDemandé()).to.be.true;
      }
    });
  },
);

Alors(
  `une demande de main-levée de garanties financières ne devrait plus être consultable pour le projet {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const actualReadModel =
        await mediator.send<GarantiesFinancières.ConsulterMainLevéeGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.MainLevée.Query.Consulter',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });

      expect(Option.isNone(actualReadModel)).to.be.true;
    });
  },
);
