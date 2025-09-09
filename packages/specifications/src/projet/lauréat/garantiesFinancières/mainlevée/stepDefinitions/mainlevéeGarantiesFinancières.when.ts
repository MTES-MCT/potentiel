import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../../potentiel.world';
import { CréerDemanderMainlevéeFixtureProps } from '../fixtures/demanderMainlevée.fixture';
import { convertFixtureFileToReadableStream } from '../../../../../helpers/convertFixtureFileToReadable';

Quand(
  'le porteur demande la mainlevée des garanties financières',
  async function (this: PotentielWorld) {
    try {
      await demanderMainlevée.call(this);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur demande la mainlevée des garanties financières avec :',
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      await demanderMainlevée.call(
        this,
        this.lauréatWorld.garantiesFinancièresWorld.mainlevée.mapToExemple(exemple),
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur annule la demande de mainlevée des garanties financières avec :',
  async function (this: PotentielWorld, dataTable: DataTable) {
    const annulationData = dataTable.rowsHash();

    try {
      const { identifiantProjet } = this.lauréatWorld;
      const utilisateur = annulationData['utilisateur'] || 'porteur@test.test';
      const date = annulationData['date annulation'] || '2024-01-01';

      await mediator.send<Lauréat.GarantiesFinancières.AnnulerMainlevéeGarantiesFinancièresUseCase>(
        {
          type: 'Lauréat.GarantiesFinancières.UseCase.AnnulerMainlevée',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            annuléLeValue: new Date(date).toISOString(),
            annuléParValue: utilisateur,
          },
        },
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur Dreal démarre l'instruction de la demande de mainlevée des garanties financières`,
  async function (this: PotentielWorld) {
    try {
      await démarrerInstructionMainlevée.call(this);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur Dreal accorde la demande de mainlevée des garanties financières`,
  async function (this: PotentielWorld) {
    try {
      await accorderMainlevée.call(this);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur Dreal rejette la demande de mainlevée des garanties financières`,
  async function (this: PotentielWorld) {
    try {
      await rejeterMainlevée.call(this);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

export async function demanderMainlevée(
  this: PotentielWorld,
  props: CréerDemanderMainlevéeFixtureProps = {},
) {
  const { identifiantProjet } = this.lauréatWorld;

  const { projetAbandonné, projetAchevé } =
    Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières;
  const aTransmisAttestationConformité =
    this.lauréatWorld.achèvementWorld.transmettreOuModifierAttestationConformitéFixture.aÉtéCréé;

  const { demandéLe, motif, demandéPar } =
    this.lauréatWorld.garantiesFinancièresWorld.mainlevée.demander.créer({
      motif: aTransmisAttestationConformité ? projetAchevé.motif : projetAbandonné.motif,
      ...props,
    });

  await mediator.send<Lauréat.GarantiesFinancières.DemanderMainlevéeGarantiesFinancièresUseCase>({
    type: 'Lauréat.GarantiesFinancières.UseCase.DemanderMainlevée',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
      motifValue: motif,
      demandéLeValue: demandéLe,
      demandéParValue: demandéPar,
    },
  });
}

export async function démarrerInstructionMainlevée(this: PotentielWorld) {
  const { identifiantProjet } = this.lauréatWorld;

  const { démarréeLe, démarréePar } =
    this.lauréatWorld.garantiesFinancièresWorld.mainlevée.passerEnInstruction.créer();

  await mediator.send<Lauréat.GarantiesFinancières.DémarrerInstructionMainlevéeGarantiesFinancièresUseCase>(
    {
      type: 'Lauréat.GarantiesFinancières.UseCase.DémarrerInstructionMainlevée',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        démarréLeValue: démarréeLe,
        démarréParValue: démarréePar,
      },
    },
  );
}

export async function accorderMainlevée(this: PotentielWorld) {
  const { identifiantProjet } = this.lauréatWorld;
  const { accordéLe, accordéPar, courrierAccord } =
    this.lauréatWorld.garantiesFinancièresWorld.mainlevée.accorder.créer();

  await mediator.send<Lauréat.GarantiesFinancières.AccorderMainlevéeGarantiesFinancièresUseCase>({
    type: 'Lauréat.GarantiesFinancières.UseCase.AccorderMainlevée',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
      accordéLeValue: accordéLe,
      accordéParValue: accordéPar,
      réponseSignéeValue: convertFixtureFileToReadableStream(courrierAccord),
    },
  });
}

export async function rejeterMainlevée(this: PotentielWorld) {
  const { identifiantProjet } = this.lauréatWorld;

  const { courrierRejet, rejetéeLe, rejetéePar } =
    this.lauréatWorld.garantiesFinancièresWorld.mainlevée.rejeter.créer();
  await mediator.send<Lauréat.GarantiesFinancières.RejeterMainlevéeGarantiesFinancièresUseCase>({
    type: 'Lauréat.GarantiesFinancières.UseCase.RejeterMainlevée',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
      rejetéLeValue: rejetéeLe,
      rejetéParValue: rejetéePar,
      réponseSignéeValue: convertFixtureFileToReadableStream(courrierRejet),
    },
  });
}
