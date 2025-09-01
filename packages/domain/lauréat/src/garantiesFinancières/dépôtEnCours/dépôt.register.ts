import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { registerModifierDépôtGarantiesFinancièresEnCoursCommand } from './modifierDépôtEnCours/modifierDépôtGarantiesFinancièresEnCours.command';
import { registerModifierDépôtGarantiesFinancièresEnCoursUseCase } from './modifierDépôtEnCours/modifierDépôtGarantiesFinancièresEnCours.usecase';
import { registerSupprimerDépôtGarantiesFinancièresEnCoursCommand } from './supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.command';
import { registerSupprimerGarantiesFinancièresÀTraiterUseCase } from './supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.usecase';

export const registerDépôt = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  // commands
  registerSupprimerDépôtGarantiesFinancièresEnCoursCommand(loadAggregate, getProjetAggregateRoot);
  registerModifierDépôtGarantiesFinancièresEnCoursCommand(loadAggregate);

  // usecases
  registerSupprimerGarantiesFinancièresÀTraiterUseCase();
  registerModifierDépôtGarantiesFinancièresEnCoursUseCase();
};
