import type {
  ConsulterReprésentantLégalQuery,
  ConsulterReprésentantLégalReadModel,
} from './consulter/consulterReprésentantLégal.query';
import { ModifierReprésentantLégalUseCase } from './modifier/modifierReprésentantLégal.usecase';
import { DemanderChangementReprésentantLégalUseCase } from './changement/demander/demanderChangementReprésentantLégal.usecase';
import { AccorderChangementReprésentantLégalUseCase } from './changement/accorder/accorderChangementReprésentantLégal.usecase';
import { RejeterChangementReprésentantLégalUseCase } from './changement/rejeter/rejeterChangementReprésentantLégal.usecase';
import {
  ConsulterChangementReprésentantLégalQuery,
  ConsulterChangementReprésentantLégalReadModel,
} from './changement/consulter/consulterChangementReprésentantLégal.query';
import {
  ListerChangementReprésentantLégalQuery,
  ListerChangementReprésentantLégalReadModel,
} from './changement/lister/listerChangementReprésentantLégal.query';
import { AnnulerChangementReprésentantLégalUseCase } from './changement/annuler/annulerChangementReprésentantLégal.usecase';
import { CorrigerChangementReprésentantLégalUseCase } from './changement/corriger/corrigerChangementReprésentantLégal.usecase';
import {
  ConsulterChangementReprésentantLégalEnCoursQuery,
  ConsulterChangementReprésentantLégalEnCoursReadModel,
} from './changement/consulter/consulterChangementReprésentantLégalEnCours.query';
import {
  ListerHistoriqueReprésentantLégalProjetQuery,
  HistoriqueReprésentantLégalProjetListItemReadModel,
} from './listerHistorique/listerHistoriqueReprésentantLégalProjet.query';
import { EnregistrerChangementReprésentantLégalUseCase } from './changement/enregistrer/enregistrerChangementReprésentantLégal.usecase';

// Query
export type ReprésentantLégalQuery =
  | ConsulterReprésentantLégalQuery
  | ConsulterChangementReprésentantLégalQuery
  | ConsulterChangementReprésentantLégalEnCoursQuery
  | ListerChangementReprésentantLégalQuery
  | ListerHistoriqueReprésentantLégalProjetQuery;

export {
  ConsulterReprésentantLégalQuery,
  ConsulterChangementReprésentantLégalQuery,
  ConsulterChangementReprésentantLégalEnCoursQuery,
  ListerChangementReprésentantLégalQuery,
  ListerHistoriqueReprésentantLégalProjetQuery,
};

// ReadModel
export {
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

export type { ModifierReprésentantLégalUseCase } from './modifier/modifierReprésentantLégal.usecase';
export type { DemanderChangementReprésentantLégalUseCase } from './changement/demander/demanderChangementReprésentantLégal.usecase';
export type { AnnulerChangementReprésentantLégalUseCase } from './changement/annuler/annulerChangementReprésentantLégal.usecase';
export type { CorrigerChangementReprésentantLégalUseCase } from './changement/corriger/corrigerChangementReprésentantLégal.usecase';
export type { AccorderChangementReprésentantLégalUseCase } from './changement/accorder/accorderChangementReprésentantLégal.usecase';
export type { RejeterChangementReprésentantLégalUseCase } from './changement/rejeter/rejeterChangementReprésentantLégal.usecase';
export type { EnregistrerChangementReprésentantLégalUseCase } from './changement/enregistrer/enregistrerChangementReprésentantLégal.usecase';

// Event
export * from './représentantLégal.event';

// Register
export {
  registerReprésentantLégalQueries,
  registerReprésentantLégalUseCases,
} from './représentantLégal.register';

// Entities
export * from './représentantLégal.entity';
export * from './changement/changementReprésentantLégal.entity';

// ValueType
export * as TypeReprésentantLégal from './typeReprésentantLégal.valueType';
export * as TypeDocumentChangementReprésentantLégal from './changement/typeDocumentChangementReprésentantLégal.valueType';
export * as TypeTâchePlanifiéeChangementReprésentantLégal from './changement/typeTâchePlanifiéeChangementReprésentantLégal.valueType';
export * as StatutChangementReprésentantLégal from './changement/statutChangementReprésentantLégal.valueType';

// Saga
export * as ReprésentantLégalSaga from './saga/représentantLégal.saga';
