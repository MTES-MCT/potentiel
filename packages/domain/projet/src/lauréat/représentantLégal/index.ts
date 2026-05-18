import type { AccorderChangementReprésentantLégalUseCase } from './changement/accorder/accorderChangementReprésentantLégal.usecase.js';
import type { AnnulerChangementReprésentantLégalUseCase } from './changement/annuler/annulerChangementReprésentantLégal.usecase.js';
import type {
  ConsulterChangementReprésentantLégalQuery,
  ConsulterChangementReprésentantLégalReadModel,
} from './changement/consulter/consulterChangementReprésentantLégal.query.js';
import type {
  ConsulterChangementReprésentantLégalEnCoursQuery,
  ConsulterChangementReprésentantLégalEnCoursReadModel,
} from './changement/consulter/consulterChangementReprésentantLégalEnCours.query.js';
import type { CorrigerChangementReprésentantLégalUseCase } from './changement/corriger/corrigerChangementReprésentantLégal.usecase.js';
import type { DemanderChangementReprésentantLégalUseCase } from './changement/demander/demanderChangementReprésentantLégal.usecase.js';
import type { EnregistrerChangementReprésentantLégalUseCase } from './changement/enregistrer/enregistrerChangementReprésentantLégal.usecase.js';
import type {
  ListerChangementReprésentantLégalQuery,
  ListerChangementReprésentantLégalReadModel,
} from './changement/lister/listerChangementReprésentantLégal.query.js';
import type { RejeterChangementReprésentantLégalUseCase } from './changement/rejeter/rejeterChangementReprésentantLégal.usecase.js';
import type {
  ConsulterReprésentantLégalQuery,
  ConsulterReprésentantLégalReadModel,
} from './consulter/consulterReprésentantLégal.query.js';
import type {
  HistoriqueReprésentantLégalProjetListItemReadModel,
  ListerHistoriqueReprésentantLégalProjetQuery,
} from './listerHistorique/listerHistoriqueReprésentantLégalProjet.query.js';
import type { ModifierReprésentantLégalUseCase } from './modifier/modifierReprésentantLégal.usecase.js';

// Query
export type ReprésentantLégalQuery =
  | ConsulterReprésentantLégalQuery
  | ConsulterChangementReprésentantLégalQuery
  | ConsulterChangementReprésentantLégalEnCoursQuery
  | ListerChangementReprésentantLégalQuery
  | ListerHistoriqueReprésentantLégalProjetQuery;

// ReadModel
export type {
  ConsulterChangementReprésentantLégalEnCoursQuery,
  ConsulterChangementReprésentantLégalEnCoursReadModel,
  ConsulterChangementReprésentantLégalQuery,
  ConsulterChangementReprésentantLégalReadModel,
  ConsulterReprésentantLégalQuery,
  ConsulterReprésentantLégalReadModel,
  HistoriqueReprésentantLégalProjetListItemReadModel,
  ListerChangementReprésentantLégalQuery,
  ListerChangementReprésentantLégalReadModel,
  ListerHistoriqueReprésentantLégalProjetQuery,
};

// UseCase
export type ReprésentantLégalUseCase =
  | ModifierReprésentantLégalUseCase
  | DemanderChangementReprésentantLégalUseCase
  | AnnulerChangementReprésentantLégalUseCase
  | CorrigerChangementReprésentantLégalUseCase
  | AccorderChangementReprésentantLégalUseCase
  | RejeterChangementReprésentantLégalUseCase
  | EnregistrerChangementReprésentantLégalUseCase;

export type { AccorderChangementReprésentantLégalUseCase } from './changement/accorder/accorderChangementReprésentantLégal.usecase.js';
export type { AnnulerChangementReprésentantLégalUseCase } from './changement/annuler/annulerChangementReprésentantLégal.usecase.js';
export type * from './changement/changementReprésentantLégal.entity.js';
export type { CorrigerChangementReprésentantLégalUseCase } from './changement/corriger/corrigerChangementReprésentantLégal.usecase.js';
export type { DemanderChangementReprésentantLégalUseCase } from './changement/demander/demanderChangementReprésentantLégal.usecase.js';
export * as DocumentChangementReprésentantLégal from './changement/documentChangementReprésentantLégal.valueType.js';
export type { EnregistrerChangementReprésentantLégalUseCase } from './changement/enregistrer/enregistrerChangementReprésentantLégal.usecase.js';
export type { RejeterChangementReprésentantLégalUseCase } from './changement/rejeter/rejeterChangementReprésentantLégal.usecase.js';
export * as StatutChangementReprésentantLégal from './changement/statutChangementReprésentantLégal.valueType.js';
export * as TypeTâchePlanifiéeChangementReprésentantLégal from './changement/typeTâchePlanifiéeChangementReprésentantLégal.valueType.js';
export type { ModifierReprésentantLégalUseCase } from './modifier/modifierReprésentantLégal.usecase.js';
// Entities
export type * from './représentantLégal.entity.js';
// Event
export type * from './représentantLégal.event.js';
// Register
export {
  registerReprésentantLégalQueries,
  registerReprésentantLégalUseCases,
} from './représentantLégal.register.js';
// Saga
export * as ReprésentantLégalSaga from './saga/représentantLégal.saga.js';
// ValueType
export * as TypeReprésentantLégal from './typeReprésentantLégal.valueType.js';
