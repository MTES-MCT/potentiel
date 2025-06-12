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
import { EffacerHistoriqueGarantiesFinancièresCommand } from './effacerHistorique/effacerHistoriqueGarantiesFinancières.command';
import { DemanderGarantiesFinancièresCommand } from './demander/demanderGarantiesFinancières.command';

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
  | DemanderGarantiesFinancièresUseCase
  | SupprimerGarantiesFinancièresÀTraiterUseCase
  | ValiderDépôtGarantiesFinancièresEnCoursUseCase
  | ModifierDépôtGarantiesFinancièresEnCoursUseCase
  | ImporterTypeGarantiesFinancièresUseCase
  | ModifierGarantiesFinancièresUseCase
  | EnregistrerAttestationGarantiesFinancièresUseCase
  | EnregistrerGarantiesFinancièresUseCase
  | EffacerHistoriqueGarantiesFinancièresUseCase
  | DemanderMainlevéeGarantiesFinancièresUseCase
  | AnnulerMainlevéeGarantiesFinancièresUseCase
  | DémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase
  | RejeterDemandeMainlevéeGarantiesFinancièresUseCase
  | AccorderDemandeMainlevéeGarantiesFinancièresUseCase;

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
  DemanderMainlevéeGarantiesFinancièresUseCase,
  AnnulerMainlevéeGarantiesFinancièresUseCase,
  DémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase,
  RejeterDemandeMainlevéeGarantiesFinancièresUseCase,
  AccorderDemandeMainlevéeGarantiesFinancièresUseCase,
};

// Command
export type { EffacerHistoriqueGarantiesFinancièresCommand, DemanderGarantiesFinancièresCommand };

// Event

// type global
export type { GarantiesFinancièresEvent } from './garantiesFinancières.aggregate';

// Dépot
export type { DépôtGarantiesFinancièresSoumisEvent } from './dépôtEnCours/soumettreDépôt/soumettreDépôtGarantiesFinancières.behavior';
export type { DépôtGarantiesFinancièresEnCoursModifiéEvent } from './dépôtEnCours/modifierDépôtEnCours/modifierDépôtGarantiesFinancièresEnCours.behavior';
export type {
  DépôtGarantiesFinancièresEnCoursSuppriméEvent,
  DépôtGarantiesFinancièresEnCoursSuppriméEventV1,
} from './dépôtEnCours/supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.behavior';

// Gf actuelles
export type { TypeGarantiesFinancièresImportéEvent } from './garantiesFinancièresActuelles/importer/importerTypeGarantiesFinancières.behavior';
export type { AttestationGarantiesFinancièresEnregistréeEvent } from './garantiesFinancièresActuelles/enregistrerAttestation/enregistrerAttestationGarantiesFinancières.behavior';
export type { GarantiesFinancièresDemandéesEvent } from './demander/demanderGarantiesFinancières.behavior';
export type { GarantiesFinancièresÉchuesEvent } from './garantiesFinancièresActuelles/échoir/échoirGarantiesFinancières.behavior';

// Mainlevée
export type { MainlevéeGarantiesFinancièresDemandéeEvent } from './mainlevée/demander/demanderMainlevéeGarantiesFinancières.behavior';
export type { DemandeMainlevéeGarantiesFinancièresAnnuléeEvent } from './mainlevée/annuler/annulerDemandeMainlevéeGarantiesFinancières.behavior';
export type { InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent } from './mainlevée/démarrerInstruction/démarrerInstructionDemandeMainlevéeGarantiesFinancières.behavior';
export type { DemandeMainlevéeGarantiesFinancièresRejetéeEvent } from './mainlevée/rejeter/rejeterDemandeMainlevéeGarantiesFinancières.behavior';
export type { DemandeMainlevéeGarantiesFinancièresAccordéeEvent } from './mainlevée/accorder/accorderDemandeMainlevéeGarantiesFinancières.behavior';

// Register
export {
  registerGarantiesFinancièresQueries,
  registerGarantiesFinancièresUseCases,
} from './garantiesFinancières.register';

// ValueTypes
export * as TypeDocumentGarantiesFinancières from './typeDocumentGarantiesFinancières.valueType';
export * as StatutMainlevéeGarantiesFinancières from './mainlevée/statutMainlevéeGarantiesFinancières.valueType';
export * as MotifDemandeMainlevéeGarantiesFinancières from './mainlevée/motifDemandeMainlevéeGarantiesFinancières.valueType';
export * as TypeDocumentRéponseDemandeMainlevée from './mainlevée/typeDocumentRéponseDemandeMainlevée.valueType';
export * as TypeTâchePlanifiéeGarantiesFinancières from './typeTâchePlanifiéeGarantiesFinancières.valueType';
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
export * as TypeGarantiesFinancièresSaga from './typeGarantiesFinancières.saga';

// utils
export * from './_utils/appelOffreSoumisAuxGarantiesFinancières';
