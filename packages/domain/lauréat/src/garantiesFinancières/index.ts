import type {
  ConsulterDépôtEnCoursGarantiesFinancièresQuery,
  ConsulterDépôtEnCoursGarantiesFinancièresReadModel,
} from './dépôtEnCours/consulter/consulterDépôtEnCoursGarantiesFinancières.query';
import type {
  ListerDépôtsEnCoursGarantiesFinancièresQuery,
  ListerDépôtsEnCoursGarantiesFinancièresReadModel,
} from './dépôtEnCours/lister/listerDépôtsEnCoursGarantiesFinancières.query';
import type { ModifierDépôtGarantiesFinancièresEnCoursUseCase } from './dépôtEnCours/modifierDépôtEnCours/modifierDépôtGarantiesFinancièresEnCours.usecase';
import type { SoumettreDépôtGarantiesFinancièresUseCase } from './dépôtEnCours/soumettreDépôt/soumettreDépôtGarantiesFinancières.usecase';
import type { SupprimerGarantiesFinancièresÀTraiterUseCase } from './dépôtEnCours/supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.usecase';
import type { ValiderDépôtGarantiesFinancièresEnCoursUseCase } from './dépôtEnCours/validerDépôtEnCours/validerDépôtGarantiesFinancièresEnCours.usecase';
import type {
  ConsulterGarantiesFinancièresQuery,
  ConsulterGarantiesFinancièresReadModel,
  GarantiesFinancièresReadModel,
} from './garantiesFinancièresActuelles/consulter/consulterGarantiesFinancières.query';
import type {
  ConsulterArchivesGarantiesFinancièresQuery,
  ConsulterArchivesGarantiesFinancièresReadModel,
} from './garantiesFinancièresActuelles/consulterArchives/consulterArchivesGarantiesFinancières.query';
import type { AccorderDemandeMainlevéeGarantiesFinancièresUseCase } from './mainlevée/accorder/accorderDemandeMainlevéeGarantiesFinancières.usecase';
import type { AnnulerMainlevéeGarantiesFinancièresUseCase } from './mainlevée/annuler/annulerDemandeMainlevéeGarantiesFinancières.usecase';
import type { DemanderMainlevéeGarantiesFinancièresUseCase } from './mainlevée/demander/demanderMainlevéeGarantiesFinancières.usecase';
import type { DémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase } from './mainlevée/démarrerInstruction/démarrerInstructionDemandeMainlevéeGarantiesFinancières.usecase';
import type {
  ListerMainlevéeItemReadModel,
  ListerMainlevéesQuery,
  ListerMainlevéesReadModel,
} from './mainlevée/lister/listerMainlevéesGarantiesFinancières.query';
import type { RejeterDemandeMainlevéeGarantiesFinancièresUseCase } from './mainlevée/rejeter/rejeterDemandeMainlevéeGarantiesFinancières.usecase';
import type {
  ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery,
  ConsulterProjetAvecGarantiesFinancièresEnAttenteReadModel,
} from './projetEnAttenteDeGarantiesFinancières/consulter/consulterProjetAvecGarantiesFinancièresEnAttente.query';
import type {
  ListerProjetsAvecGarantiesFinancièresEnAttenteQuery,
  ListerProjetsAvecGarantiesFinancièresEnAttenteReadModel,
} from './projetEnAttenteDeGarantiesFinancières/lister/listerProjetsAvecGarantiesFinancièresEnAttente.query';

// Query
export type GarantiesFinancièresQuery =
  | ConsulterGarantiesFinancièresQuery
  | ConsulterArchivesGarantiesFinancièresQuery
  | ConsulterDépôtEnCoursGarantiesFinancièresQuery
  | ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery
  | ListerDépôtsEnCoursGarantiesFinancièresQuery
  | ListerProjetsAvecGarantiesFinancièresEnAttenteQuery
  | ListerDépôtsEnCoursGarantiesFinancièresQuery
  | ListerMainlevéesQuery;

export type {
  ConsulterGarantiesFinancièresQuery,
  ConsulterArchivesGarantiesFinancièresQuery,
  ConsulterDépôtEnCoursGarantiesFinancièresQuery,
  ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery,
  ListerDépôtsEnCoursGarantiesFinancièresQuery,
  ListerProjetsAvecGarantiesFinancièresEnAttenteQuery,
  ListerMainlevéesQuery,
};

// ReadModel
export type {
  GarantiesFinancièresReadModel,
  ConsulterGarantiesFinancièresReadModel,
  ConsulterArchivesGarantiesFinancièresReadModel,
  ConsulterDépôtEnCoursGarantiesFinancièresReadModel,
  ConsulterProjetAvecGarantiesFinancièresEnAttenteReadModel,
  ListerDépôtsEnCoursGarantiesFinancièresReadModel,
  ListerProjetsAvecGarantiesFinancièresEnAttenteReadModel,
  ListerMainlevéesReadModel,
  ListerMainlevéeItemReadModel,
};

// UseCases
export type GarantiesFinancièresUseCase =
  | SoumettreDépôtGarantiesFinancièresUseCase
  | SupprimerGarantiesFinancièresÀTraiterUseCase
  | ValiderDépôtGarantiesFinancièresEnCoursUseCase
  | ModifierDépôtGarantiesFinancièresEnCoursUseCase
  | DemanderMainlevéeGarantiesFinancièresUseCase
  | AnnulerMainlevéeGarantiesFinancièresUseCase
  | DémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase
  | RejeterDemandeMainlevéeGarantiesFinancièresUseCase
  | AccorderDemandeMainlevéeGarantiesFinancièresUseCase;

export type {
  SoumettreDépôtGarantiesFinancièresUseCase,
  SupprimerGarantiesFinancièresÀTraiterUseCase,
  ValiderDépôtGarantiesFinancièresEnCoursUseCase,
  ModifierDépôtGarantiesFinancièresEnCoursUseCase,
  DemanderMainlevéeGarantiesFinancièresUseCase,
  AnnulerMainlevéeGarantiesFinancièresUseCase,
  DémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase,
  RejeterDemandeMainlevéeGarantiesFinancièresUseCase,
  AccorderDemandeMainlevéeGarantiesFinancièresUseCase,
};

// Event

// utils
export * from './_utils/appelOffreSoumisAuxGarantiesFinancières';
export * from './dépôtEnCours/dépôtEnCoursGarantiesFinancières.entity';
// type global
export type { GarantiesFinancièresEvent } from './garantiesFinancières.aggregate';
// Register
export {
  registerGarantiesFinancièresQueries,
  registerGarantiesFinancièresUseCases,
} from './garantiesFinancières.register';
export * from './garantiesFinancièresActuelles/archivesGarantiesFinancières.entity';
// Entities
export * from './garantiesFinancièresActuelles/garantiesFinancièresActuelles.entity';
export * as MotifArchivageGarantiesFinancières from './garantiesFinancièresActuelles/motifArchivageGarantiesFinancières.valueType';
export * as StatutGarantiesFinancières from './garantiesFinancièresActuelles/statutGarantiesFinancières.valueType';
export * from './mainlevée/mainlevéeGarantiesFinancières.entity';
export * as StatutMainlevéeGarantiesFinancières from './mainlevée/statutMainlevéeGarantiesFinancières.valueType';
export * as TypeDocumentRéponseDemandeMainlevée from './mainlevée/typeDocumentRéponseDemandeMainlevée.valueType';
export * from './projetEnAttenteDeGarantiesFinancières/projetAvecGarantiesFinancièresEnAttente.entity';
// ValueTypes
export * as TypeDocumentGarantiesFinancières from './typeDocumentGarantiesFinancières.valueType';
