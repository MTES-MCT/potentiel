import type { AccorderChangementReprésentantLégalUseCase } from './changement/accorder/accorderChangementReprésentantLégal.usecase';
import type { AnnulerChangementReprésentantLégalUseCase } from './changement/annuler/annulerChangementReprésentantLégal.usecase';
import {
  ConsulterChangementReprésentantLégalQuery,
  ConsulterChangementReprésentantLégalReadModel,
} from './changement/consulter/consulterChangementReprésentantLégal.query';
import {
  ConsulterChangementReprésentantLégalEnCoursQuery,
  ConsulterChangementReprésentantLégalEnCoursReadModel,
} from './changement/consulter/consulterChangementReprésentantLégalEnCours.query';
import type { CorrigerChangementReprésentantLégalUseCase } from './changement/corriger/corrigerChangementReprésentantLégal.usecase';
import type { DemanderChangementReprésentantLégalUseCase } from './changement/demander/demanderChangementReprésentantLégal.usecase';
import type { EnregistrerChangementReprésentantLégalUseCase } from './changement/enregistrer/enregistrerChangementReprésentantLégal.usecase';
import {
  ListerChangementReprésentantLégalQuery,
  ListerChangementReprésentantLégalReadModel,
} from './changement/lister/listerChangementReprésentantLégal.query';
import type { RejeterChangementReprésentantLégalUseCase } from './changement/rejeter/rejeterChangementReprésentantLégal.usecase';
import type {
  ConsulterReprésentantLégalQuery,
  ConsulterReprésentantLégalReadModel,
} from './consulter/consulterReprésentantLégal.query';
import {
  HistoriqueReprésentantLégalProjetListItemReadModel,
  ListerHistoriqueReprésentantLégalProjetQuery,
} from './listerHistorique/listerHistoriqueReprésentantLégalProjet.query';
import type { ModifierReprésentantLégalUseCase } from './modifier/modifierReprésentantLégal.usecase';

// Query
export type ReprésentantLégalQuery =
  | ConsulterReprésentantLégalQuery
  | ConsulterChangementReprésentantLégalQuery
  | ConsulterChangementReprésentantLégalEnCoursQuery
  | ListerChangementReprésentantLégalQuery
  | ListerHistoriqueReprésentantLégalProjetQuery;

export {
  type ConsulterReprésentantLégalQuery,
  ConsulterChangementReprésentantLégalQuery,
  ConsulterChangementReprésentantLégalEnCoursQuery,
  ListerChangementReprésentantLégalQuery,
  ListerHistoriqueReprésentantLégalProjetQuery,
};

// ReadModel
export {
  type ConsulterReprésentantLégalReadModel,
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

export type { AccorderChangementReprésentantLégalUseCase } from './changement/accorder/accorderChangementReprésentantLégal.usecase';
export type { AnnulerChangementReprésentantLégalUseCase } from './changement/annuler/annulerChangementReprésentantLégal.usecase';
export * from './changement/changementReprésentantLégal.entity';
export type { CorrigerChangementReprésentantLégalUseCase } from './changement/corriger/corrigerChangementReprésentantLégal.usecase';
export type { DemanderChangementReprésentantLégalUseCase } from './changement/demander/demanderChangementReprésentantLégal.usecase';
export type { EnregistrerChangementReprésentantLégalUseCase } from './changement/enregistrer/enregistrerChangementReprésentantLégal.usecase';
export type { RejeterChangementReprésentantLégalUseCase } from './changement/rejeter/rejeterChangementReprésentantLégal.usecase';
export * as StatutChangementReprésentantLégal from './changement/statutChangementReprésentantLégal.valueType';
// Ports
export type { SupprimerDocumentProjetSensiblePort } from './changement/supprimerDocumentSensible/supprimerDocumentProjetSensible.command';
export * as TypeDocumentChangementReprésentantLégal from './changement/typeDocumentChangementReprésentantLégal.valueType';
export * as TypeTâchePlanifiéeChangementReprésentantLégal from './changement/typeTâchePlanifiéeChangementReprésentantLégal.valueType';
export type { ModifierReprésentantLégalUseCase } from './modifier/modifierReprésentantLégal.usecase';
// Entities
export * from './représentantLégal.entity';
// Event
export * from './représentantLégal.event';
// Register
export {
  registerReprésentantLégalQueries,
  registerReprésentantLégalUseCases,
} from './représentantLégal.register';
// Saga
export * as ReprésentantLégalSaga from './saga';
// ValueType
export * as TypeReprésentantLégal from './typeReprésentantLégal.valueType';
