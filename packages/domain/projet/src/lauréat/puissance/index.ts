import type { AccorderChangementPuissanceUseCase } from './changement/accorder/accorderChangementPuissance.usecase';
import type { AnnulerChangementPuissanceUseCase } from './changement/annuler/annulerChangementPuissance.usecase';
import type {
  ConsulterChangementPuissanceQuery,
  ConsulterChangementPuissanceReadModel,
} from './changement/consulter/consulterChangementPuissance.query';
import type { DemanderChangementUseCase } from './changement/demander/demanderChangementPuissance.usecase';
import type { EnregistrerChangementPuissanceUseCase } from './changement/enregistrerChangement/enregistrerChangementPuissance.usecase';
import type {
  ListerChangementPuissanceQuery,
  ListerChangementPuissanceReadModel,
} from './changement/lister/listerChangementPuissance.query';
import type { RejeterChangementPuissanceUseCase } from './changement/rejeter/rejeterChangementPuissance.usecase';
import type {
  ConsulterPuissanceQuery,
  ConsulterPuissanceReadModel,
} from './consulter/consulterPuissance.query';
import type {
  HistoriquePuissanceProjetListItemReadModel,
  ListerHistoriquePuissanceProjetQuery,
  ListerHistoriquePuissanceProjetReadModel,
} from './listerHistorique/listerHistoriquePuissanceProjet.query';
import type { ModifierPuissanceUseCase } from './modifier/modifierPuissance.usecase';

// Query
export type PuissanceQuery =
  | ConsulterPuissanceQuery
  | ConsulterChangementPuissanceQuery
  | ListerChangementPuissanceQuery
  | ListerHistoriquePuissanceProjetQuery;
export type {
  ConsulterPuissanceQuery,
  ConsulterChangementPuissanceQuery,
  ListerChangementPuissanceQuery,
  ListerHistoriquePuissanceProjetQuery,
};

// ReadModel
export type {
  ConsulterPuissanceReadModel,
  ConsulterChangementPuissanceReadModel,
  ListerChangementPuissanceReadModel,
  ListerHistoriquePuissanceProjetReadModel,
  HistoriquePuissanceProjetListItemReadModel,
};

// UseCase
export type PuissanceUseCase =
  | ModifierPuissanceUseCase
  | DemanderChangementUseCase
  | AnnulerChangementPuissanceUseCase
  | EnregistrerChangementPuissanceUseCase
  | AccorderChangementPuissanceUseCase
  | RejeterChangementPuissanceUseCase;

export type {
  ModifierPuissanceUseCase,
  DemanderChangementUseCase,
  AnnulerChangementPuissanceUseCase,
  AccorderChangementPuissanceUseCase,
  EnregistrerChangementPuissanceUseCase,
  RejeterChangementPuissanceUseCase,
};

export type { ChangementPuissanceAccordéEvent } from './changement/accorder/accorderChangementPuissance.event';
export type { ChangementPuissanceAnnuléEvent } from './changement/annuler/annulerChangementPuissance.event';
export * from './changement/changementPuissance.entity';
export type { ChangementPuissanceDemandéEvent } from './changement/demander/demanderChangementPuissance.event';
export type { ChangementPuissanceEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangementPuissance.event';
export type { ChangementPuissanceRejetéEvent } from './changement/rejeter/rejeterChangementPuissance.event';
export type { ChangementPuissanceSuppriméEvent } from './changement/supprimer/supprimerChangementPuissance.event';
export type { PuissanceImportéeEvent } from './importer/importerPuissance.event';
export type { PuissanceModifiéeEvent } from './modifier/modifierPuissance.event';
// Entities
export * from './puissance.entity';
// Event
export type { PuissanceEvent } from './puissance.event';
export * as AutoritéCompétente from './valueType/autoritéCompétente.valueType';
export * as RatioChangementPuissance from './valueType/ratioChangementPuissance.valueType';
// ValueType
export * as StatutChangementPuissance from './valueType/statutChangementPuissance.valueType';
export * as TypeDocumentPuissance from './valueType/typeDocumentPuissance.valueType';
