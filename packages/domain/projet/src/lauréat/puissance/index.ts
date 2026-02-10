import {
  ConsulterPuissanceQuery,
  ConsulterPuissanceReadModel,
} from './consulter/consulterPuissance.query.js';
import { DemanderChangementUseCase } from './changement/demander/demanderChangementPuissance.usecase.js';
import { AccorderChangementPuissanceUseCase } from './changement/accorder/accorderChangementPuissance.usecase.js';
import { ModifierPuissanceUseCase } from './modifier/modifierPuissance.usecase.js';
import {
  ConsulterChangementPuissanceQuery,
  ConsulterChangementPuissanceReadModel,
} from './changement/consulter/consulterChangementPuissance.query.js';
import { AnnulerChangementPuissanceUseCase } from './changement/annuler/annulerChangementPuissance.usecase.js';
import { EnregistrerChangementPuissanceUseCase } from './changement/enregistrerChangement/enregistrerChangementPuissance.usecase.js';
import { RejeterChangementPuissanceUseCase } from './changement/rejeter/rejeterChangementPuissance.usecase.js';
import {
  ListerChangementPuissanceQuery,
  ListerChangementPuissanceReadModel,
} from './changement/lister/listerChangementPuissance.query.js';
import {
  ListerHistoriquePuissanceProjetQuery,
  HistoriquePuissanceProjetListItemReadModel,
  ListerHistoriquePuissanceProjetReadModel,
} from './listerHistorique/listerHistoriquePuissanceProjet.query.js';
import {
  ConsulterVolumeRéservéReadModel,
  ConsulterVolumeRéservéQuery,
} from './consulter/consulterVolumeRéservé.query.js';
// Query
export type PuissanceQuery =
  | ConsulterPuissanceQuery
  | ConsulterChangementPuissanceQuery
  | ListerChangementPuissanceQuery
  | ListerHistoriquePuissanceProjetQuery
  | ConsulterVolumeRéservéQuery;

export type {
  ConsulterPuissanceQuery,
  ConsulterChangementPuissanceQuery,
  ListerChangementPuissanceQuery,
  ListerHistoriquePuissanceProjetQuery,
  ConsulterVolumeRéservéQuery,
};

// ReadModel
export type {
  ConsulterPuissanceReadModel,
  ConsulterChangementPuissanceReadModel,
  ListerChangementPuissanceReadModel,
  ListerHistoriquePuissanceProjetReadModel,
  HistoriquePuissanceProjetListItemReadModel,
  ConsulterVolumeRéservéReadModel,
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

// Event
export type { PuissanceEvent } from './puissance.event.js';
export type { PuissanceImportéeEvent } from './importer/importerPuissance.event.js';
export type { PuissanceModifiéeEvent } from './modifier/modifierPuissance.event.js';
export type { ChangementPuissanceDemandéEvent } from './changement/demander/demanderChangementPuissance.event.js';
export type { ChangementPuissanceAnnuléEvent } from './changement/annuler/annulerChangementPuissance.event.js';
export type { ChangementPuissanceSuppriméEvent } from './changement/supprimer/supprimerChangementPuissance.event.js';
export type { ChangementPuissanceEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangementPuissance.event.js';
export type { ChangementPuissanceAccordéEvent } from './changement/accorder/accorderChangementPuissance.event.js';
export type { ChangementPuissanceRejetéEvent } from './changement/rejeter/rejeterChangementPuissance.event.js';

// Entities
export type * from './puissance.entity.js';
export type * from './changement/changementPuissance.entity.js';

// ValueType
export * as StatutChangementPuissance from './valueType/statutChangementPuissance.valueType.js';
export * as TypeDocumentPuissance from './valueType/typeDocumentPuissance.valueType.js';
export * as RatioChangementPuissance from './valueType/ratioChangementPuissance.valueType.js';
export * as AutoritéCompétente from './valueType/autoritéCompétente.valueType.js';
export * as VolumeRéservé from './valueType/volumeRéservé.valueType.js';
