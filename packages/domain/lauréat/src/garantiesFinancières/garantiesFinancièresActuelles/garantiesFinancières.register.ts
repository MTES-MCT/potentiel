import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { registerSupprimerGarantiesFinancièresÀTraiterUseCase } from '../dépôtEnCours/supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.usecase';

import { registerEnregistrerGarantiesFinancièresUseCase } from './enregistrer/enregistrerGarantiesFinancières.usecase';
import { registerÉchoirGarantiesFinancièresCommand } from './échoir/échoirGarantiesFinancières.command';
import { registerEnregistrerGarantiesFinancièresCommand } from './enregistrer/enregistrerGarantiesFinancières.command';

export const registerGarantiesFinancières = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  // commands
  registerEnregistrerGarantiesFinancièresCommand(loadAggregate, getProjetAggregateRoot);
  registerÉchoirGarantiesFinancièresCommand(loadAggregate, getProjetAggregateRoot);

  // usecases
  registerSupprimerGarantiesFinancièresÀTraiterUseCase();

  registerEnregistrerGarantiesFinancièresUseCase();
};
