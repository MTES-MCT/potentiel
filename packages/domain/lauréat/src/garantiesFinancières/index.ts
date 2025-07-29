import { SoumettreDépôtGarantiesFinancièresUseCase } from './dépôtEnCours/soumettreDépôt/soumettreDépôtGarantiesFinancières.usecase';
import { SupprimerGarantiesFinancièresÀTraiterUseCase } from './dépôtEnCours/supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.usecase';
import { ValiderDépôtGarantiesFinancièresEnCoursUseCase } from './dépôtEnCours/validerDépôtEnCours/validerDépôtGarantiesFinancièresEnCours.usecase';
import { ModifierDépôtGarantiesFinancièresEnCoursUseCase } from './dépôtEnCours/modifierDépôtEnCours/modifierDépôtGarantiesFinancièresEnCours.usecase';
import { EnregistrerGarantiesFinancièresUseCase } from './garantiesFinancièresActuelles/enregistrer/enregistrerGarantiesFinancières.usecase';
import {
  ListerDépôtsEnCoursGarantiesFinancièresQuery,
  ListerDépôtsEnCoursGarantiesFinancièresReadModel,
} from './dépôtEnCours/lister/listerDépôtsEnCoursGarantiesFinancières.query';
import {
  ConsulterGarantiesFinancièresQuery,
  ConsulterGarantiesFinancièresReadModel,
  GarantiesFinancièresReadModel,
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
import { DemanderMainlevéeGarantiesFinancièresUseCase } from './mainlevée/demander/demanderMainlevéeGarantiesFinancières.usecase';
import { AnnulerMainlevéeGarantiesFinancièresUseCase } from './mainlevée/annuler/annulerDemandeMainlevéeGarantiesFinancières.usecase';
import { DémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase } from './mainlevée/démarrerInstruction/démarrerInstructionDemandeMainlevéeGarantiesFinancières.usecase';
import { RejeterDemandeMainlevéeGarantiesFinancièresUseCase } from './mainlevée/rejeter/rejeterDemandeMainlevéeGarantiesFinancières.usecase';
import { AccorderDemandeMainlevéeGarantiesFinancièresUseCase } from './mainlevée/accorder/accorderDemandeMainlevéeGarantiesFinancières.usecase';
import {
  ListerMainlevéeItemReadModel,
  ListerMainlevéesQuery,
  ListerMainlevéesReadModel,
} from './mainlevée/lister/listerMainlevéesGarantiesFinancières.query';
import {
  ConsulterArchivesGarantiesFinancièresQuery,
  ConsulterArchivesGarantiesFinancièresReadModel,
} from './garantiesFinancièresActuelles/consulterArchives/consulterArchivesGarantiesFinancières.query';

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
  | EnregistrerGarantiesFinancièresUseCase
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
  EnregistrerGarantiesFinancièresUseCase,
  DemanderMainlevéeGarantiesFinancièresUseCase,
  AnnulerMainlevéeGarantiesFinancièresUseCase,
  DémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase,
  RejeterDemandeMainlevéeGarantiesFinancièresUseCase,
  AccorderDemandeMainlevéeGarantiesFinancièresUseCase,
};

// Event

// type global
export type { GarantiesFinancièresEvent } from './garantiesFinancières.aggregate';

// Register
export {
  registerGarantiesFinancièresQueries,
  registerGarantiesFinancièresUseCases,
} from './garantiesFinancières.register';

// ValueTypes
export * as TypeDocumentGarantiesFinancières from './typeDocumentGarantiesFinancières.valueType';
export * as StatutMainlevéeGarantiesFinancières from './mainlevée/statutMainlevéeGarantiesFinancières.valueType';
export * as TypeDocumentRéponseDemandeMainlevée from './mainlevée/typeDocumentRéponseDemandeMainlevée.valueType';
export * as StatutGarantiesFinancières from './garantiesFinancièresActuelles/statutGarantiesFinancières.valueType';
export * as MotifArchivageGarantiesFinancières from './garantiesFinancièresActuelles/motifArchivageGarantiesFinancières.valueType';

// Entities
export * from './garantiesFinancièresActuelles/garantiesFinancièresActuelles.entity';
export * from './garantiesFinancièresActuelles/archivesGarantiesFinancières.entity';
export * from './dépôtEnCours/dépôtEnCoursGarantiesFinancières.entity';
export * from './projetEnAttenteDeGarantiesFinancières/projetAvecGarantiesFinancièresEnAttente.entity';
export * from './mainlevée/mainlevéeGarantiesFinancières.entity';

// Saga
export * as GarantiesFinancièresSaga from './garantiesFinancières.saga';

// utils
export * from './_utils/appelOffreSoumisAuxGarantiesFinancières';
