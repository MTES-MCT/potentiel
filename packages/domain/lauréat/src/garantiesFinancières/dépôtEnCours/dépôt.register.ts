import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { registerSupprimerDépôtGarantiesFinancièresEnCoursCommand } from './supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.command';
import { registerSupprimerGarantiesFinancièresÀTraiterUseCase } from './supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.usecase';

export const registerDépôt = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  // commands
  registerSupprimerDépôtGarantiesFinancièresEnCoursCommand(loadAggregate, getProjetAggregateRoot);

  // usecases
  registerSupprimerGarantiesFinancièresÀTraiterUseCase();
};
