import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../../potentiel.world';
import { sleep } from '../../../../../helpers/sleep';

import {
  setAccordMainlevéeData,
  setDemandeMainlevéeData,
  setInstructionDemandeMainlevéeData,
  setRejetMainlevéeData,
} from './helper';

Quand(
  'le porteur demande la mainlevée des garanties financières pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const motif = exemple['motif'];
      const utilisateur = exemple['utilisateur'];
      const date = exemple['date demande'];

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.DemanderMainlevéeGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.Demander',
        data: setDemandeMainlevéeData({ motif, utilisateur, date, identifiantProjet }),
      });
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur annule la demande de mainlevée des garanties financières pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const annulationData = dataTable.rowsHash();

    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
      const utilisateur = annulationData['utilisateur'] || 'porteur@test.test';
      const date = annulationData['date annulation'] || '2024-01-01';

      await mediator.send<GarantiesFinancières.AnnulerMainlevéeGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.Annuler',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          annuléLeValue: new Date(date).toISOString(),
          annuléParValue: utilisateur,
        },
      });
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur Dreal démarre l'instruction de la demande de mainlevée des garanties financières du projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const utilisateur = exemple['utilisateur'];
      const date = exemple['date'];

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.DémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase>(
        {
          type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.DémarrerInstruction',
          data: setInstructionDemandeMainlevéeData({ identifiantProjet, utilisateur, date }),
        },
      );
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur Dreal démarre l'instruction de la demande de mainlevée des garanties financières du projet {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.DémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase>(
        {
          type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.DémarrerInstruction',
          data: setInstructionDemandeMainlevéeData({ identifiantProjet }),
        },
      );
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur Dreal accorde la demande de mainlevée des garanties financières du projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const utilisateur = exemple['utilisateur'];
      const date = exemple['date'];
      const documentContenu = exemple['contenu fichier réponse'];
      const documentFormat = exemple['format fichier réponse'];

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.AccorderDemandeMainlevéeGarantiesFinancièresUseCase>(
        {
          type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.AccorderDemandeMainlevée',
          data: setAccordMainlevéeData({
            identifiantProjet,
            utilisateur,
            date,
            documentFormat,
            documentContenu,
          }),
        },
      );
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur Dreal accorde la demande de mainlevée des garanties financières du projet {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.AccorderDemandeMainlevéeGarantiesFinancièresUseCase>(
        {
          type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.AccorderDemandeMainlevée',
          data: setAccordMainlevéeData({
            identifiantProjet,
          }),
        },
      );
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur Dreal rejette une demande de mainlevée des garanties financières du projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      const utilisateur = exemple['utilisateur'];
      const date = exemple['date'];
      const documentContenu = exemple['contenu fichier réponse'];
      const documentFormat = exemple['format fichier réponse'];

      await mediator.send<GarantiesFinancières.RejeterDemandeMainlevéeGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.RejeterDemandeMainlevée',
        data: setRejetMainlevéeData({
          identifiantProjet,
          utilisateur,
          date,
          documentFormat,
          documentContenu,
        }),
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur Dreal rejette une demande de mainlevée des garanties financières du projet {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.RejeterDemandeMainlevéeGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.RejeterDemandeMainlevée',
        data: setRejetMainlevéeData({ identifiantProjet }),
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
