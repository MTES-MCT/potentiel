import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { registerSupprimerGarantiesFinancièresÀTraiterUseCase } from '../dépôtEnCours/supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.usecase';

import { registerEnregistrerGarantiesFinancièresUseCase } from './enregistrer/enregistrerGarantiesFinancières.usecase';
import { registerEnregistrerAttestationGarantiesFinancièresCommand } from './enregistrerAttestation/enregistrerAttestationGarantiesFinancières.command';
import { registerEnregistrerAttestationGarantiesFinancièresUseCase } from './enregistrerAttestation/enregistrerAttestationGarantiesFinancières.usecase';
import { registerModifierGarantiesFinancièresUseCase } from './modifier/modifierGarantiesFinancières.usecase';
import { registerÉchoirGarantiesFinancièresCommand } from './échoir/échoirGarantiesFinancières.command';
import { registerEnregistrerGarantiesFinancièresCommand } from './enregistrer/enregistrerGarantiesFinancières.command';
import { registerModifierGarantiesFinancièresCommand } from './modifier/modifierGarantiesFinancières.command';

export const registerGarantiesFinancières = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  // commands
  registerModifierGarantiesFinancièresCommand(loadAggregate, getProjetAggregateRoot);
  registerEnregistrerAttestationGarantiesFinancièresCommand(loadAggregate);
  registerEnregistrerGarantiesFinancièresCommand(loadAggregate, getProjetAggregateRoot);
  registerÉchoirGarantiesFinancièresCommand(loadAggregate, getProjetAggregateRoot);

  // usecases
  registerSupprimerGarantiesFinancièresÀTraiterUseCase();
  registerModifierGarantiesFinancièresUseCase();
  registerEnregistrerAttestationGarantiesFinancièresUseCase();
  registerEnregistrerGarantiesFinancièresUseCase();
};
