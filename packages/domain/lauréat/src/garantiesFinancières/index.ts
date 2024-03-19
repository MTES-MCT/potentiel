import {
  ConsulterGarantiesFinancièresQuery,
  ConsulterGarantiesFinancièresReadModel,
} from './consulter/consulterGarantiesFinancières.query';
import { SoumettreDépôtGarantiesFinancièresUseCase } from './dépôt/soumettreDépôt/soumettreDépôtGarantiesFinancières.usecase';
import { DemanderGarantiesFinancièresUseCase } from './demander/demanderGarantiesFinancières.usecase';
import { SupprimerGarantiesFinancièresÀTraiterUseCase } from './dépôt/supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.usecase';
import { ValiderDépôtGarantiesFinancièresEnCoursUseCase } from './dépôt/validerDépôtEnCours/validerDépôtGarantiesFinancièresEnCours.usecase';
import { ModifierDépôtGarantiesFinancièresEnCoursUseCase } from './dépôt/modifierDépôtEnCours/modifierDépôtGarantiesFinancièresEnCours.usecase';
import {
  ListerDépôtsEnCoursGarantiesFinancièresQuery,
  ListerDépôtsEnCoursGarantiesFinancièresReadModel,
  ListerDépôtsEnCoursGarantiesFinancièresPort,
} from './dépôt/lister/listerDépôtsEnCoursGarantiesFinancières.query';

import { ImporterTypeGarantiesFinancièresUseCase } from './importer/importerTypeGarantiesFinancières.usecase';
import { ModifierGarantiesFinancièresUseCase } from './modifier/modifierGarantiesFinancières.usecase';
import { EnregistrerAttestationGarantiesFinancièresUseCase } from './enregistrerAttestation/enregistrerAttestationGarantiesFinancières.usecase';
import { EnregistrerGarantiesFinancièresUseCase } from './enregistrer/enregistrerGarantiesFinancières.usecase';

// Query
export type GarantiesFinancièresQuery =
  | ConsulterGarantiesFinancièresQuery
  | ListerDépôtsEnCoursGarantiesFinancièresQuery;

export { ConsulterGarantiesFinancièresQuery, ListerDépôtsEnCoursGarantiesFinancièresQuery };

// ReadModel
export { ConsulterGarantiesFinancièresReadModel, ListerDépôtsEnCoursGarantiesFinancièresReadModel };

// UseCases
export type GarantiesFinancièresUseCase =
  | SoumettreDépôtGarantiesFinancièresUseCase
  | DemanderGarantiesFinancièresUseCase
  | SupprimerGarantiesFinancièresÀTraiterUseCase
  | ValiderDépôtGarantiesFinancièresEnCoursUseCase
  | ModifierDépôtGarantiesFinancièresEnCoursUseCase
  | ImporterTypeGarantiesFinancièresUseCase
  | ModifierGarantiesFinancièresUseCase
  | EnregistrerAttestationGarantiesFinancièresUseCase
  | EnregistrerGarantiesFinancièresUseCase;

export {
  SoumettreDépôtGarantiesFinancièresUseCase,
  DemanderGarantiesFinancièresUseCase,
  SupprimerGarantiesFinancièresÀTraiterUseCase,
  ValiderDépôtGarantiesFinancièresEnCoursUseCase,
  ModifierDépôtGarantiesFinancièresEnCoursUseCase,
  ImporterTypeGarantiesFinancièresUseCase,
  ModifierGarantiesFinancièresUseCase,
  EnregistrerAttestationGarantiesFinancièresUseCase,
  EnregistrerGarantiesFinancièresUseCase,
};

// Event
export { GarantiesFinancièresEvent } from './garantiesFinancières.aggregate';
export { DépôtGarantiesFinancièresSoumisEvent } from './dépôt/soumettreDépôt/soumettreDépôtGarantiesFinancières.behavior';
export { GarantiesFinancièresDemandéesEvent } from './demander/demanderGarantiesFinancières.behavior';
export { DépôtGarantiesFinancièresEnCoursSuppriméEvent } from './dépôt/supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.behavior';
export { DépôtGarantiesFinancièresEnCoursValidéEvent } from './dépôt/validerDépôtEnCours/validerDépôtGarantiesFinancièresEnCours.behavior';
export { DépôtGarantiesFinancièresEnCoursModifiéEvent } from './dépôt/modifierDépôtEnCours/modifierDépôtGarantiesFinancièresEnCours.behavior';
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
export * from './dépôtEnCoursGarantiesFinancières.entity';

// Ports
export { ListerDépôtsEnCoursGarantiesFinancièresPort };
