import { LoadAggregate } from '@potentiel-domain/core';
import {
  ConsulterGarantiesFinancièresDependencies,
  registerConsulterGarantiesFinancièresQuery,
} from './consulter/consulterGarantiesFinancières.query';
import { registerSoumettreGarantiesFinancièresCommand } from './soumettre/soumettreGarantiesFinancières.command';
import { registerDemanderGarantiesFinancièresCommand } from './demander/demanderGarantiesFinancières.command';
import { registerSoumettreGarantiesFinancièresUseCase } from './soumettre/soumettreGarantiesFinancières.usecase';
import { registerDemanderGarantiesFinancièresUseCase } from './demander/demanderGarantiesFinancières.usecase';
import {
  ListerGarantiesFinancièresDependencies,
  registerListerGarantiesFinancièresQuery,
} from './lister/listerGarantiesFinancières.query';
import { registerSupprimerGarantiesFinancièresÀTraiterCommand } from './supprimerGarantiesFinancièresÀTraiter/supprimerGarantiesFinancièresÀTraiter.command';
import { registerSupprimerGarantiesFinancièresÀTraiterUseCase } from './supprimerGarantiesFinancièresÀTraiter/supprimerGarantiesFinancièresÀTraiter.usecase';
import { registerValiderGarantiesFinancièresCommand } from './valider/validerGarantiesFinancières.command';
import { registerValiderGarantiesFinancièresUseCase } from './valider/validerGarantiesFinancières.usecase';
import { registerModifierGarantiesFinancièresÀTraiterUseCase } from './modifierGarantiesFinancièresÀTraiter/modifierGarantiesFinancièresÀTraiter.usecase';
import { registerModifierGarantiesFinancièresÀTraiterCommand } from './modifierGarantiesFinancièresÀTraiter/modifierGarantiesFinancièresÀTraiter.command';
import { registerImporterTypeGarantiesFinancièresCommand } from './importer/importerTypeGarantiesFinancières.command';
import { registerImporterTypeGarantiesFinancièresUseCase } from './importer/importerTypeGarantiesFinancières.usecase';
import { registerModifierGarantiesFinancièresUseCase } from './modifier/modifierGarantiesFinancières.usecase';
import { registerModifierGarantiesFinancièresCommand } from './modifier/modifierGarantiesFinancières.command';
import { registerEnregistrerAttestationGarantiesFinancièresCommand } from './enregistrerAttestation/enregistrerAttestationGarantiesFinancières.command';
import { registerEnregistrerAttestationGarantiesFinancièresUseCase } from './enregistrerAttestation/enregistrerAttestationGarantiesFinancières.usecase';

export type GarantiesFinancièresQueryDependencies = ConsulterGarantiesFinancièresDependencies &
  ListerGarantiesFinancièresDependencies;

export type GarantiesFinancièresCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerGarantiesFinancièresUseCases = ({
  loadAggregate,
}: GarantiesFinancièresCommandDependencies) => {
  registerSoumettreGarantiesFinancièresCommand(loadAggregate);
  registerDemanderGarantiesFinancièresCommand(loadAggregate);
  registerSupprimerGarantiesFinancièresÀTraiterCommand(loadAggregate);
  registerValiderGarantiesFinancièresCommand(loadAggregate);
  registerModifierGarantiesFinancièresÀTraiterCommand(loadAggregate);
  registerImporterTypeGarantiesFinancièresCommand(loadAggregate);
  registerModifierGarantiesFinancièresCommand(loadAggregate);
  registerEnregistrerAttestationGarantiesFinancièresCommand(loadAggregate);

  registerSoumettreGarantiesFinancièresUseCase();
  registerDemanderGarantiesFinancièresUseCase();
  registerSupprimerGarantiesFinancièresÀTraiterUseCase();
  registerValiderGarantiesFinancièresUseCase();
  registerModifierGarantiesFinancièresÀTraiterUseCase();
  registerImporterTypeGarantiesFinancièresUseCase();
  registerModifierGarantiesFinancièresUseCase();
  registerEnregistrerAttestationGarantiesFinancièresUseCase();
};

export const registerGarantiesFinancièresQueries = (
  dependencies: GarantiesFinancièresQueryDependencies,
) => {
  registerConsulterGarantiesFinancièresQuery(dependencies);
  registerListerGarantiesFinancièresQuery(dependencies);
};
