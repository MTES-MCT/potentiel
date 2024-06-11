import { SoumettreDépôtGarantiesFinancièresUseCase } from './dépôtEnCours/soumettreDépôt/soumettreDépôtGarantiesFinancières.usecase';
import { DemanderGarantiesFinancièresUseCase } from './demander/demanderGarantiesFinancières.usecase';
import { SupprimerGarantiesFinancièresÀTraiterUseCase } from './dépôtEnCours/supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.usecase';
import { ValiderDépôtGarantiesFinancièresEnCoursUseCase } from './dépôtEnCours/validerDépôtEnCours/validerDépôtGarantiesFinancièresEnCours.usecase';
import { ModifierDépôtGarantiesFinancièresEnCoursUseCase } from './dépôtEnCours/modifierDépôtEnCours/modifierDépôtGarantiesFinancièresEnCours.usecase';
import { EnregistrerGarantiesFinancièresUseCase } from './garantiesFinancièresActuelles/enregistrer/enregistrerGarantiesFinancières.usecase';
import { EnregistrerAttestationGarantiesFinancièresUseCase } from './garantiesFinancièresActuelles/enregistrerAttestation/enregistrerAttestationGarantiesFinancières.usecase';
import { ImporterTypeGarantiesFinancièresUseCase } from './garantiesFinancièresActuelles/importer/importerTypeGarantiesFinancières.usecase';
import { ModifierGarantiesFinancièresUseCase } from './garantiesFinancièresActuelles/modifier/modifierGarantiesFinancières.usecase';
import {
  ListerDépôtsEnCoursGarantiesFinancièresQuery,
  ListerDépôtsEnCoursGarantiesFinancièresReadModel,
} from './dépôtEnCours/lister/listerDépôtsEnCoursGarantiesFinancières.query';
import { EffacerHistoriqueGarantiesFinancièresUseCase } from './effacerHistorique/effacerHistoriqueGarantiesFinancières.usecase';
import {
  ConsulterGarantiesFinancièresQuery,
  ConsulterGarantiesFinancièresReadModel,
} from './garantiesFinancièresActuelles/consulter/consulterGarantiesFinancières.query';
import {
  ListerProjetsAvecGarantiesFinancièresEnAttenteQuery,
  ListerProjetsAvecGarantiesFinancièresEnAttenteReadModel,
} from './projetEnAttenteDeGarantiesFinancières/lister/listerProjetsAvecGarantiesFinancièresEnAttente.query';
import {
  ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery,
  ConsulterProjetAvecGarantiesFinancièresEnAttenteReadModel,
} from './projetEnAttenteDeGarantiesFinancières/consulter/consulterProjetAvecGarantiesFinancièresEnAttente.query';
import {
  ConsulterDépôtEnCoursGarantiesFinancièresQuery,
  ConsulterDépôtEnCoursGarantiesFinancièresReadModel,
} from './dépôtEnCours/consulter/consulterDépôtEnCoursGarantiesFinancières.query';
import {
  GénérerModèleMiseEnDemeureGarantiesFinancièresQuery,
  GénérerModèleMiseEnDemeureGarantiesFinancièresReadModel,
} from './projetEnAttenteDeGarantiesFinancières/générerModèleMiseEnDemeure/générerModèleMiseEnDemeure.query';
import { DemanderMainLevéeGarantiesFinancièresUseCase } from './mainLevée/demander/demanderMainLevéeGarantiesFinancières.usecase';
import {
  ConsulterMainLevéeGarantiesFinancièresQuery,
  ConsulterMainLevéeGarantiesFinancièresReadModel,
} from './mainLevée/consulter/consulterMainLevéeGarantiesFinancières.query';
import { AnnulerMainLevéeGarantiesFinancièresUseCase } from './mainLevée/annuler/annulerDemandeMainLevéeGarantiesFinancières.usecase';
import {
  ListerDemandeMainlevéeQuery,
  ListerDemandeMainlevéeReadModel,
} from './mainLevée/lister/listerDemandeMainlevéeGarantiesFinancières.query';
// Query
export type GarantiesFinancièresQuery =
  | ConsulterGarantiesFinancièresQuery
  | ConsulterDépôtEnCoursGarantiesFinancièresQuery
  | ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery
  | ListerDépôtsEnCoursGarantiesFinancièresQuery
  | ListerProjetsAvecGarantiesFinancièresEnAttenteQuery
  | ListerDépôtsEnCoursGarantiesFinancièresQuery
  | GénérerModèleMiseEnDemeureGarantiesFinancièresQuery
  | ConsulterMainLevéeGarantiesFinancièresQuery
  | ListerDemandeMainlevéeQuery;

export type {
  ConsulterGarantiesFinancièresQuery,
  ConsulterDépôtEnCoursGarantiesFinancièresQuery,
  ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery,
  ListerDépôtsEnCoursGarantiesFinancièresQuery,
  ListerProjetsAvecGarantiesFinancièresEnAttenteQuery,
  GénérerModèleMiseEnDemeureGarantiesFinancièresQuery,
  ConsulterMainLevéeGarantiesFinancièresQuery,
  ListerDemandeMainlevéeQuery,
};

// ReadModel
export type {
  ConsulterGarantiesFinancièresReadModel,
  ConsulterDépôtEnCoursGarantiesFinancièresReadModel,
  ConsulterProjetAvecGarantiesFinancièresEnAttenteReadModel,
  ListerDépôtsEnCoursGarantiesFinancièresReadModel,
  ListerProjetsAvecGarantiesFinancièresEnAttenteReadModel,
  GénérerModèleMiseEnDemeureGarantiesFinancièresReadModel,
  ConsulterMainLevéeGarantiesFinancièresReadModel,
  ListerDemandeMainlevéeReadModel,
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
  | EffacerHistoriqueGarantiesFinancièresUseCase
  | DemanderMainLevéeGarantiesFinancièresUseCase
  | AnnulerMainLevéeGarantiesFinancièresUseCase;

export type {
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
  DemanderMainLevéeGarantiesFinancièresUseCase,
  AnnulerMainLevéeGarantiesFinancièresUseCase,
};

// Event
export type { GarantiesFinancièresEvent } from './garantiesFinancières.aggregate';
export type { DépôtGarantiesFinancièresSoumisEvent } from './dépôtEnCours/soumettreDépôt/soumettreDépôtGarantiesFinancières.behavior';
export type { GarantiesFinancièresDemandéesEvent } from './demander/demanderGarantiesFinancières.behavior';
export type { DépôtGarantiesFinancièresEnCoursSuppriméEvent } from './dépôtEnCours/supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.behavior';
export type { DépôtGarantiesFinancièresEnCoursValidéEvent } from './dépôtEnCours/validerDépôtEnCours/validerDépôtGarantiesFinancièresEnCours.behavior';
export type { DépôtGarantiesFinancièresEnCoursModifiéEvent } from './dépôtEnCours/modifierDépôtEnCours/modifierDépôtGarantiesFinancièresEnCours.behavior';
export type { TypeGarantiesFinancièresImportéEvent } from './garantiesFinancièresActuelles/importer/importerTypeGarantiesFinancières.behavior';
export type { GarantiesFinancièresModifiéesEvent } from './garantiesFinancièresActuelles/modifier/modifierGarantiesFinancières.behavior';
export type { AttestationGarantiesFinancièresEnregistréeEvent } from './garantiesFinancièresActuelles/enregistrerAttestation/enregistrerAttestationGarantiesFinancières.behavior';
export type { HistoriqueGarantiesFinancièresEffacéEvent } from './effacerHistorique/effacerHistoriqueGarantiesFinancières.behavior';
export type { GarantiesFinancièresEnregistréesEvent } from './garantiesFinancièresActuelles/enregistrer/enregistrerGarantiesFinancières.behavior';
export type { MainLevéeGarantiesFinancièresDemandéeEvent } from './mainLevée/demander/demanderMainLevéeGarantiesFinancières.behavior';
export type { DemandeMainLevéeGarantiesFinancièresAnnuléeEvent } from './mainLevée/annuler/annulerDemandeMainLevéeGarantiesFinancières.behavior';

// Register
export {
  registerGarantiesFinancièresQueries,
  registerGarantiesFinancièresUseCases,
} from './garantiesFinancières.register';

// ValueTypes
export * as GarantiesFinancières from './garantiesFinancières.valueType';
export * as TypeGarantiesFinancières from './typeGarantiesFinancières.valueType';
export * as TypeDocumentGarantiesFinancières from './typeDocumentGarantiesFinancières.valueType';
export * as MotifDemandeGarantiesFinancières from './motifDemandeGarantiesFinancières.valueType';
export * as StatutMainLevéeGarantiesFinancières from './mainLevée/statutMainLevéeGarantiesFinancières.valueType';
export * as MotifDemandeMainLevéeGarantiesFinancières from './mainLevée/motifDemandeMainLevéeGarantiesFinancières.valueType';

// Projections
export * from './garantiesFinancièresActuelles/garantiesFinancièresActuelles.entity';
export * from './dépôtEnCours/dépôtEnCoursGarantiesFinancières.entity';
export * from './projetEnAttenteDeGarantiesFinancières/projetAvecGarantiesFinancièresEnAttente.entity';
export * from './mainLevée/mainLevéeGarantiesFinancières.entity';

// Ports
export type { BuildModèleMiseEnDemeureGarantiesFinancièresPort } from './projetEnAttenteDeGarantiesFinancières/générerModèleMiseEnDemeure/générerModèleMiseEnDemeure.query';
