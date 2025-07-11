import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { registerModifierDépôtGarantiesFinancièresEnCoursCommand } from './modifierDépôtEnCours/modifierDépôtGarantiesFinancièresEnCours.command';
import { registerModifierDépôtGarantiesFinancièresEnCoursUseCase } from './modifierDépôtEnCours/modifierDépôtGarantiesFinancièresEnCours.usecase';
import { registerDépôtSoumettreGarantiesFinancièresCommand } from './soumettreDépôt/soumettreDépôtGarantiesFinancières.command';
import { registerSoumettreDépôtGarantiesFinancièresUseCase } from './soumettreDépôt/soumettreDépôtGarantiesFinancières.usecase';
import { registerSupprimerDépôtGarantiesFinancièresEnCoursCommand } from './supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.command';
import { registerValiderDépôtGarantiesFinancièresEnCoursCommand } from './validerDépôtEnCours/validerDépôtGarantiesFinancièresEnCours.command';
import { registerValiderDépôtGarantiesFinancièresEnCoursUseCase } from './validerDépôtEnCours/validerDépôtGarantiesFinancièresEnCours.usecase';

export const registerDépôt = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  // commands
  registerDépôtSoumettreGarantiesFinancièresCommand(loadAggregate, getProjetAggregateRoot);
  registerValiderDépôtGarantiesFinancièresEnCoursCommand(loadAggregate, getProjetAggregateRoot);
  registerSupprimerDépôtGarantiesFinancièresEnCoursCommand(loadAggregate, getProjetAggregateRoot);
  registerModifierDépôtGarantiesFinancièresEnCoursCommand(loadAggregate);

  // usecases
  registerSoumettreDépôtGarantiesFinancièresUseCase();
  registerValiderDépôtGarantiesFinancièresEnCoursUseCase();
  registerModifierDépôtGarantiesFinancièresEnCoursUseCase();
};
