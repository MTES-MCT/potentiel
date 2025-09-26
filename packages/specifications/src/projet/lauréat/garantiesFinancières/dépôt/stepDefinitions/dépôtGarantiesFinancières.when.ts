import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../.././../potentiel.world';
import { SoumettreDépôtGarantiesFinancièresProps } from '../fixtures/soumettre.fixture';
import { ValiderDépôtGarantiesFinancièresProps } from '../fixtures/valider.fixture';
import { convertFixtureFileToReadableStream } from '../../../../../helpers/convertFixtureFileToReadable';

Quand(
  'un porteur soumet un dépôt de garanties financières pour le projet lauréat',
  async function (this: PotentielWorld) {
    try {
      await soumettreDépôt.call(this, this.lauréatWorld.identifiantProjet, {});
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'un porteur soumet un dépôt de garanties financières pour le projet lauréat avec :',
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      await soumettreDépôt.call(
        this,
        this.lauréatWorld.identifiantProjet,
        this.lauréatWorld.garantiesFinancièresWorld.dépôt.mapExempleToUseCaseData(exemple),
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur modifie le dépôt de garanties financières avec :',
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      await modifierDépôt.call(
        this,
        this.lauréatWorld.identifiantProjet,
        this.lauréatWorld.garantiesFinancièresWorld.dépôt.mapExempleToUseCaseData(exemple),
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur supprime le dépôt de garanties financières du projet',
  async function (this: PotentielWorld) {
    try {
      await mediator.send<Lauréat.GarantiesFinancières.SupprimerDépôtGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.SupprimerDépôtGarantiesFinancières',
        data: {
          identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
          suppriméLeValue: new Date().toISOString(),
          suppriméParValue: 'porteur@test.test',
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `l'utilisateur dreal valide le dépôt de garanties financières`,
  async function (this: PotentielWorld) {
    try {
      await validerDépôtEnCours.call(this, this.lauréatWorld.identifiantProjet, {});
    } catch (error) {
      this.error = error as Error;
    }
  },
);

export async function soumettreDépôt(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  props: SoumettreDépôtGarantiesFinancièresProps,
) {
  const { attestation, dateConstitution, soumisLe, soumisPar, type, dateÉchéance } =
    this.lauréatWorld.garantiesFinancièresWorld.dépôt.soumettre.créer({
      ...props,
    });
  await mediator.send<Lauréat.GarantiesFinancières.SoumettreDépôtGarantiesFinancièresUseCase>({
    type: 'Lauréat.GarantiesFinancières.UseCase.SoumettreDépôtGarantiesFinancières',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
      typeValue: type,
      dateÉchéanceValue: dateÉchéance,
      attestationValue: convertFixtureFileToReadableStream(attestation),
      dateConstitutionValue: dateConstitution,
      soumisLeValue: soumisLe,
      soumisParValue: soumisPar,
    },
  });
}

export async function modifierDépôt(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  props: SoumettreDépôtGarantiesFinancièresProps,
) {
  const { attestation, dateConstitution, soumisLe, soumisPar, type, dateÉchéance } =
    this.lauréatWorld.garantiesFinancièresWorld.dépôt.modifier.créer(props);
  await mediator.send<Lauréat.GarantiesFinancières.ModifierDépôtGarantiesFinancièresEnCoursUseCase>(
    {
      type: 'Lauréat.GarantiesFinancières.UseCase.ModifierDépôtGarantiesFinancièresEnCours',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        typeValue: type,
        dateÉchéanceValue: dateÉchéance,
        dateConstitutionValue: new Date(dateConstitution).toISOString(),
        modifiéLeValue: new Date(soumisLe).toISOString(),
        modifiéParValue: soumisPar,
        attestationValue: convertFixtureFileToReadableStream(attestation),
      },
    },
  );
}

export async function validerDépôtEnCours(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  props: ValiderDépôtGarantiesFinancièresProps,
) {
  const { validéLe, validéPar } = this.lauréatWorld.garantiesFinancièresWorld.dépôt.valider.créer({
    validéPar: this.utilisateurWorld.drealFixture.email,
    ...props,
  });
  await mediator.send<Lauréat.GarantiesFinancières.ValiderDépôtGarantiesFinancièresEnCoursUseCase>({
    type: 'Lauréat.GarantiesFinancières.UseCase.ValiderDépôtGarantiesFinancièresEnCours',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
      validéLeValue: validéLe,
      validéParValue: validéPar,
    },
  });
}
