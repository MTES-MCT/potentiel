import type {
  ConsulterReprésentantLégalQuery,
  ConsulterReprésentantLégalReadModel,
} from './consulter/consulterReprésentantLégal.query.js';
import { ModifierReprésentantLégalUseCase } from './modifier/modifierReprésentantLégal.usecase.js';
import { DemanderChangementReprésentantLégalUseCase } from './changement/demander/demanderChangementReprésentantLégal.usecase.js';
import { AccorderChangementReprésentantLégalUseCase } from './changement/accorder/accorderChangementReprésentantLégal.usecase.js';
import { RejeterChangementReprésentantLégalUseCase } from './changement/rejeter/rejeterChangementReprésentantLégal.usecase.js';
import {
  ConsulterChangementReprésentantLégalQuery,
  ConsulterChangementReprésentantLégalReadModel,
} from './changement/consulter/consulterChangementReprésentantLégal.query.js';
import {
  ListerChangementReprésentantLégalQuery,
  ListerChangementReprésentantLégalReadModel,
} from './changement/lister/listerChangementReprésentantLégal.query.js';
import { AnnulerChangementReprésentantLégalUseCase } from './changement/annuler/annulerChangementReprésentantLégal.usecase.js';
import { CorrigerChangementReprésentantLégalUseCase } from './changement/corriger/corrigerChangementReprésentantLégal.usecase.js';
import {
  ConsulterChangementReprésentantLégalEnCoursQuery,
  ConsulterChangementReprésentantLégalEnCoursReadModel,
} from './changement/consulter/consulterChangementReprésentantLégalEnCours.query.js';
import {
  ListerHistoriqueReprésentantLégalProjetQuery,
  HistoriqueReprésentantLégalProjetListItemReadModel,
} from './listerHistorique/listerHistoriqueReprésentantLégalProjet.query.js';
import { EnregistrerChangementReprésentantLégalUseCase } from './changement/enregistrer/enregistrerChangementReprésentantLégal.usecase.js';

// Query
export type ReprésentantLégalQuery =
  | ConsulterReprésentantLégalQuery
  | ConsulterChangementReprésentantLégalQuery
  | ConsulterChangementReprésentantLégalEnCoursQuery
  | ListerChangementReprésentantLégalQuery
  | ListerHistoriqueReprésentantLégalProjetQuery;

export type {
  ConsulterReprésentantLégalQuery,
  ConsulterChangementReprésentantLégalQuery,
  ConsulterChangementReprésentantLégalEnCoursQuery,
  ListerChangementReprésentantLégalQuery,
  ListerHistoriqueReprésentantLégalProjetQuery,
};

// ReadModel
export type {
  ConsulterReprésentantLégalReadModel,
  ConsulterChangementReprésentantLégalReadModel,
  ConsulterChangementReprésentantLégalEnCoursReadModel,
  ListerChangementReprésentantLégalReadModel,
  HistoriqueReprésentantLégalProjetListItemReadModel,
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

export type { ModifierReprésentantLégalUseCase } from './modifier/modifierReprésentantLégal.usecase.js';
export type { DemanderChangementReprésentantLégalUseCase } from './changement/demander/demanderChangementReprésentantLégal.usecase.js';
export type { AnnulerChangementReprésentantLégalUseCase } from './changement/annuler/annulerChangementReprésentantLégal.usecase.js';
export type { CorrigerChangementReprésentantLégalUseCase } from './changement/corriger/corrigerChangementReprésentantLégal.usecase.js';
export type { AccorderChangementReprésentantLégalUseCase } from './changement/accorder/accorderChangementReprésentantLégal.usecase.js';
export type { RejeterChangementReprésentantLégalUseCase } from './changement/rejeter/rejeterChangementReprésentantLégal.usecase.js';
export type { EnregistrerChangementReprésentantLégalUseCase } from './changement/enregistrer/enregistrerChangementReprésentantLégal.usecase.js';

// Event
export type * from './représentantLégal.event.js';

// Register
export {
  registerReprésentantLégalQueries,
  registerReprésentantLégalUseCases,
} from './représentantLégal.register.js';

// Entities
export type * from './représentantLégal.entity.js';
export type * from './changement/changementReprésentantLégal.entity.js';

// ValueType
export * as TypeReprésentantLégal from './typeReprésentantLégal.valueType.js';
export * as TypeDocumentChangementReprésentantLégal from './changement/typeDocumentChangementReprésentantLégal.valueType.js';
export * as TypeTâchePlanifiéeChangementReprésentantLégal from './changement/typeTâchePlanifiéeChangementReprésentantLégal.valueType.js';
export * as StatutChangementReprésentantLégal from './changement/statutChangementReprésentantLégal.valueType.js';

// Saga
export * as ReprésentantLégalSaga from './saga/représentantLégal.saga.js';
