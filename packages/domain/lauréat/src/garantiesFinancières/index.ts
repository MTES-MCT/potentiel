import {
  ConsulterGarantiesFinancièresQuery,
  ConsulterGarantiesFinancièresReadModel,
} from './consulter/consulterGarantiesFinancières.query';
import { SoumettreDépôtGarantiesFinancièresUseCase } from './dépôt/soumettreDépôt/soumettreDépôtGarantiesFinancières.usecase';
import { DemanderGarantiesFinancièresUseCase } from './demander/demanderGarantiesFinancières.usecase';
import {
  ListerGarantiesFinancièresPort,
  ListerGarantiesFinancièresQuery,
  ListerGarantiesFinancièresReadModel,
} from './lister/listerGarantiesFinancières.query';
import { SupprimerGarantiesFinancièresÀTraiterUseCase } from './dépôt/supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.usecase';
import { ValiderDépôtGarantiesFinancièresEnCoursUseCase } from './dépôt/validerDépôtEnCours/validerDépôtGarantiesFinancièresEnCours.usecase';
import { ModifierDépôtGarantiesFinancièresEnCoursUseCase } from './dépôt/modifierDépôtEnCours/modifierDépôtGarantiesFinancièresEnCours.usecase';
import { ImporterTypeGarantiesFinancièresUseCase } from './importer/importerTypeGarantiesFinancières.usecase';
import { ModifierGarantiesFinancièresUseCase } from './modifier/modifierGarantiesFinancières.usecase';
import { EnregistrerAttestationGarantiesFinancièresUseCase } from './enregistrerAttestation/enregistrerAttestationGarantiesFinancières.usecase';

// Query
export type GarantiesFinancièresQuery =
  | ConsulterGarantiesFinancièresQuery
  | ListerGarantiesFinancièresQuery;

export { ConsulterGarantiesFinancièresQuery, ListerGarantiesFinancièresQuery };

// ReadModel
export { ConsulterGarantiesFinancièresReadModel, ListerGarantiesFinancièresReadModel };

// UseCases
export type GarantiesFinancièresUseCase =
  | SoumettreDépôtGarantiesFinancièresUseCase
  | DemanderGarantiesFinancièresUseCase
  | SupprimerGarantiesFinancièresÀTraiterUseCase
  | ValiderDépôtGarantiesFinancièresEnCoursUseCase
  | ModifierDépôtGarantiesFinancièresEnCoursUseCase
  | ImporterTypeGarantiesFinancièresUseCase
  | ModifierGarantiesFinancièresUseCase
  | EnregistrerAttestationGarantiesFinancièresUseCase;

export {
  SoumettreDépôtGarantiesFinancièresUseCase as SoumettreGarantiesFinancièresUseCase,
  DemanderGarantiesFinancièresUseCase,
  SupprimerGarantiesFinancièresÀTraiterUseCase,
  ValiderDépôtGarantiesFinancièresEnCoursUseCase as ValiderGarantiesFinancièresUseCase,
  ModifierDépôtGarantiesFinancièresEnCoursUseCase as ModifierDépôtGarantiesFinancièresEnCoursUseCase,
  ImporterTypeGarantiesFinancièresUseCase,
  ModifierGarantiesFinancièresUseCase,
  EnregistrerAttestationGarantiesFinancièresUseCase,
};

// Event
export { GarantiesFinancièresEvent } from './garantiesFinancières.aggregate';
export { DépôtGarantiesFinancièresSoumisEvent as GarantiesFinancièresSoumisesEvent } from './dépôt/soumettreDépôt/soumettreDépôtGarantiesFinancières.behavior';
export { GarantiesFinancièresDemandéesEvent } from './demander/demanderGarantiesFinancières.behavior';
export { DépôtGarantiesFinancièresEnCoursSuppriméEvent as GarantiesFinancièresÀTraiterSuppriméesEvent } from './dépôt/supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.behavior';
export { DépôtGarantiesFinancièresEnCoursValidéEvent as GarantiesFinancièresValidéesEvent } from './dépôt/validerDépôtEnCours/validerDépôtGarantiesFinancièresEnCours.behavior';
export { DépôtGarantiesFinancièresEnCoursModifiéEvent as GarantiesFinancièresÀTraiterModifiéesEvent } from './dépôt/modifierDépôtEnCours/modifierDépôtGarantiesFinancièresEnCours.behavior';
export { TypeGarantiesFinancièresImportéEvent } from './importer/importerTypeGarantiesFinancières.behavior';
export { GarantiesFinancièresModifiéesEvent } from './modifier/modifierGarantiesFinancières.behavior';
export { AttestationGarantiesFinancièresEnregistréeEvent } from './enregistrerAttestation/enregistrerAttestationGarantiesFinancières.behavior';

// Register
export {
  registerGarantiesFinancièresQueries,
  registerGarantiesFinancièresUseCases,
} from './garantiesFinancières.register';

// ValueTypes
export * as GarantiesFinancières from './garantiesFinancières.valueType';
export * as TypeGarantiesFinancières from './typeGarantiesFinancières.valueType';
export * as TypeDocumentGarantiesFinancières from './typeDocumentGarantiesFinancières.valueType';
export * as StatutDépôtGarantiesFinancières from './statutDépôtGarantiesFinancières.valueType';

// Projections
export * from './garantiesFinancières.entity';

// Ports
export { ListerGarantiesFinancièresPort };
