import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import {
  AjouterTâchePlanifiéeCommand,
  ExécuterTâchePlanifiéeUseCase,
} from '@potentiel-domain/tache-planifiee';
import { DateTime } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../../../potentiel.world';

import { setGarantiesFinancièresData } from './helper';

Quand(
  `un admin importe le type des garanties financières actuelles pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    // ce n'est pas exemple ce sont les données de candidature

    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.ImporterTypeGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.ImporterTypeGarantiesFinancières',
        data: setGarantiesFinancièresData({ identifiantProjet, exemple }),
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un admin modifie les garanties financières actuelles pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.ModifierGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.ModifierGarantiesFinancières',
        data: setGarantiesFinancièresData({ identifiantProjet, exemple }),
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un porteur enregistre l'attestation des garanties financières actuelles pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.EnregistrerAttestationGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.EnregistrerAttestation',
        data: setGarantiesFinancièresData({
          identifiantProjet,
          exemple,
        }),
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un admin enregistre les garanties financières actuelles pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.EnregistrerGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.EnregistrerGarantiesFinancières',
        data: setGarantiesFinancièresData({ identifiantProjet, exemple }),
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un admin échoie les garanties financières actuelles pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      const échuLeValue = new Date(exemple['à échoir le']).toISOString();

      await mediator.send<AjouterTâchePlanifiéeCommand>({
        type: 'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
        data: {
          identifiantProjet,
          tâches: [
            {
              typeTâchePlanifiée:
                GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.échoir.type,
              àExécuterLe: DateTime.convertirEnValueType(échuLeValue),
            },
          ],
        },
      });

      await mediator.send<ExécuterTâchePlanifiéeUseCase>({
        type: 'System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          typeTâchePlanifiéeValue:
            GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.échoir.type,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
