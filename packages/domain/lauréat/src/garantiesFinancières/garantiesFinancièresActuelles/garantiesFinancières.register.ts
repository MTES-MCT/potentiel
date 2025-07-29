import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { registerSupprimerGarantiesFinancièresÀTraiterUseCase } from '../dépôtEnCours/supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.usecase';

import { registerEnregistrerGarantiesFinancièresUseCase } from './enregistrer/enregistrerGarantiesFinancières.usecase';
import { registerEnregistrerAttestationGarantiesFinancièresCommand } from './enregistrerAttestation/enregistrerAttestationGarantiesFinancières.command';
import { registerEnregistrerAttestationGarantiesFinancièresUseCase } from './enregistrerAttestation/enregistrerAttestationGarantiesFinancières.usecase';
import { registerÉchoirGarantiesFinancièresCommand } from './échoir/échoirGarantiesFinancières.command';
import { registerEnregistrerGarantiesFinancièresCommand } from './enregistrer/enregistrerGarantiesFinancières.command';

export const registerGarantiesFinancières = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  // commands
  registerEnregistrerAttestationGarantiesFinancièresCommand(loadAggregate);
  registerEnregistrerGarantiesFinancièresCommand(loadAggregate, getProjetAggregateRoot);
  registerÉchoirGarantiesFinancièresCommand(loadAggregate, getProjetAggregateRoot);

  // usecases
  registerSupprimerGarantiesFinancièresÀTraiterUseCase();

  registerEnregistrerAttestationGarantiesFinancièresUseCase();
  registerEnregistrerGarantiesFinancièresUseCase();
};
