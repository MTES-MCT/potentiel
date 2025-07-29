import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { registerSupprimerGarantiesFinancièresÀTraiterUseCase } from '../dépôtEnCours/supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.usecase';

import { registerÉchoirGarantiesFinancièresCommand } from './échoir/échoirGarantiesFinancières.command';

export const registerGarantiesFinancières = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  // commands
  registerÉchoirGarantiesFinancièresCommand(loadAggregate, getProjetAggregateRoot);

  // usecases
  registerSupprimerGarantiesFinancièresÀTraiterUseCase();
};
