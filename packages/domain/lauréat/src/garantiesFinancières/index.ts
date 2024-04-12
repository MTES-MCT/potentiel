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
} from './dépôt/lister/listerDépôtsEnCoursGarantiesFinancières.query';

import { ImporterTypeGarantiesFinancièresUseCase } from './importer/importerTypeGarantiesFinancières.usecase';
import { ModifierGarantiesFinancièresUseCase } from './modifier/modifierGarantiesFinancières.usecase';
import { EnregistrerAttestationGarantiesFinancièresUseCase } from './enregistrerAttestation/enregistrerAttestationGarantiesFinancières.usecase';
import { EnregistrerGarantiesFinancièresUseCase } from './enregistrer/enregistrerGarantiesFinancières.usecase';
import { EffacerHistoriqueGarantiesFinancièresUseCase } from './effacerHistorique/effacerHistoriqueGarantiesFinancières.usecase';
import {
  ListerProjetsAvecGarantiesFinancièresEnAttenteQuery,
  ListerProjetsAvecGarantiesFinancièresEnAttenteReadModel,
} from './enAttente/lister/listerProjetsAvecGarantiesFinancièresEnAttente.query';
import {
  ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery,
  ConsulterProjetAvecGarantiesFinancièresEnAttenteReadModel,
} from './enAttente/consulter/consulterProjetAvecGarantiesFinancièresEnAttente.query';
import {
  GénérerModèleMiseEnDemeureGarantiesFinancièresQuery,
  GénérerModèleMiseEnDemeureGarantiesFinancièresReadModel,
} from './générerModèleMiseEnDemeure/générerModèleMiseEnDemeure.query';

// Query
export type GarantiesFinancièresQuery =
  | ConsulterGarantiesFinancièresQuery
  | ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery
  | ListerDépôtsEnCoursGarantiesFinancièresQuery
  | ListerProjetsAvecGarantiesFinancièresEnAttenteQuery
  | ListerDépôtsEnCoursGarantiesFinancièresQuery
  | GénérerModèleMiseEnDemeureGarantiesFinancièresQuery;

export {
  ConsulterGarantiesFinancièresQuery,
  ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery,
  ListerDépôtsEnCoursGarantiesFinancièresQuery,
  ListerProjetsAvecGarantiesFinancièresEnAttenteQuery,
  GénérerModèleMiseEnDemeureGarantiesFinancièresQuery,
};

// ReadModel
export {
  ConsulterGarantiesFinancièresReadModel,
  ConsulterProjetAvecGarantiesFinancièresEnAttenteReadModel,
  ListerDépôtsEnCoursGarantiesFinancièresReadModel,
  ListerProjetsAvecGarantiesFinancièresEnAttenteReadModel,
  GénérerModèleMiseEnDemeureGarantiesFinancièresReadModel,
};

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
  | EnregistrerGarantiesFinancièresUseCase
  | EffacerHistoriqueGarantiesFinancièresUseCase;

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
  EffacerHistoriqueGarantiesFinancièresUseCase,
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
export { HistoriqueGarantiesFinancièresEffacéEvent } from './effacerHistorique/effacerHistoriqueGarantiesFinancières.behavior';
export { GarantiesFinancièresEnregistréesEvent } from './enregistrer/enregistrerGarantiesFinancières.behavior';

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
export * as MotifDemandeGarantiesFinancières from './motifDemandeGarantiesFinancières.valueType';

// Projections
export * from './garantiesFinancières.entity';
export * from './dépôtEnCoursGarantiesFinancières.entity';
export * from './projetAvecGarantiesFinancièresEnAttente.entity';

// Ports
export { BuildModèleMiseEnDemeureGarantiesFinancièresPort } from './générerModèleMiseEnDemeure/générerModèleMiseEnDemeure.query';
