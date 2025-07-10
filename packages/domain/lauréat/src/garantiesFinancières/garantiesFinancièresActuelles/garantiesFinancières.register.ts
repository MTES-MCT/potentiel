import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { registerSupprimerGarantiesFinancièresÀTraiterUseCase } from '../dépôtEnCours/supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.usecase';

import { registerEnregistrerGarantiesFinancièresCommand } from './enregistrer/enregistrerGarantiesFinancières.command';
import { registerEnregistrerGarantiesFinancièresUseCase } from './enregistrer/enregistrerGarantiesFinancières.usecase';
import { registerEnregistrerAttestationGarantiesFinancièresCommand } from './enregistrerAttestation/enregistrerAttestationGarantiesFinancières.command';
import { registerEnregistrerAttestationGarantiesFinancièresUseCase } from './enregistrerAttestation/enregistrerAttestationGarantiesFinancières.usecase';
import { registerImporterTypeGarantiesFinancièresCommand } from './importer/importerTypeGarantiesFinancières.command';
import { registerImporterTypeGarantiesFinancièresUseCase } from './importer/importerTypeGarantiesFinancières.usecase';
import { registerModifierGarantiesFinancièresCommand } from './modifier/modifierGarantiesFinancières.command';
import { registerModifierGarantiesFinancièresUseCase } from './modifier/modifierGarantiesFinancières.usecase';
import { registerÉchoirGarantiesFinancièresCommand } from './échoir/échoirGarantiesFinancières.command';

export const registerGarantiesFinancières = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  // commands
  registerImporterTypeGarantiesFinancièresCommand(loadAggregate, getProjetAggregateRoot);
  registerModifierGarantiesFinancièresCommand(loadAggregate);
  registerEnregistrerAttestationGarantiesFinancièresCommand(loadAggregate);
  registerEnregistrerGarantiesFinancièresCommand(loadAggregate);
  registerÉchoirGarantiesFinancièresCommand(loadAggregate, getProjetAggregateRoot);

  // usecases
  registerSupprimerGarantiesFinancièresÀTraiterUseCase();
  registerImporterTypeGarantiesFinancièresUseCase();
  registerModifierGarantiesFinancièresUseCase();
  registerEnregistrerAttestationGarantiesFinancièresUseCase();
  registerEnregistrerGarantiesFinancièresUseCase();
};
