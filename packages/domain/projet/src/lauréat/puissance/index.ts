import { AccorderChangementPuissanceUseCase } from './changement/accorder/accorderChangementPuissance.usecase.js';
import { AnnulerChangementPuissanceUseCase } from './changement/annuler/annulerChangementPuissance.usecase.js';
import {
  ConsulterChangementPuissanceQuery,
  ConsulterChangementPuissanceReadModel,
} from './changement/consulter/consulterChangementPuissance.query.js';
import { DemanderChangementUseCase } from './changement/demander/demanderChangementPuissance.usecase.js';
import { EnregistrerChangementPuissanceUseCase } from './changement/enregistrerChangement/enregistrerChangementPuissance.usecase.js';
import {
  ListerChangementPuissanceQuery,
  ListerChangementPuissanceReadModel,
} from './changement/lister/listerChangementPuissance.query.js';
import { RejeterChangementPuissanceUseCase } from './changement/rejeter/rejeterChangementPuissance.usecase.js';
import {
  ConsulterPuissanceQuery,
  ConsulterPuissanceReadModel,
} from './consulter/consulterPuissance.query.js';
import {
  ConsulterVolumeRéservéQuery,
  ConsulterVolumeRéservéReadModel,
} from './consulter/consulterVolumeRéservé.query.js';
import {
  HistoriquePuissanceProjetListItemReadModel,
  ListerHistoriquePuissanceProjetQuery,
  ListerHistoriquePuissanceProjetReadModel,
} from './listerHistorique/listerHistoriquePuissanceProjet.query.js';
import { ModifierPuissanceUseCase } from './modifier/modifierPuissance.usecase.js';
// Query
export type PuissanceQuery =
  | ConsulterPuissanceQuery
  | ConsulterChangementPuissanceQuery
  | ListerChangementPuissanceQuery
  | ListerHistoriquePuissanceProjetQuery
  | ConsulterVolumeRéservéQuery;

// ReadModel
export type {
  ConsulterChangementPuissanceQuery,
  ConsulterChangementPuissanceReadModel,
  ConsulterPuissanceQuery,
  ConsulterPuissanceReadModel,
  ConsulterVolumeRéservéQuery,
  ConsulterVolumeRéservéReadModel,
  HistoriquePuissanceProjetListItemReadModel,
  ListerChangementPuissanceQuery,
  ListerChangementPuissanceReadModel,
  ListerHistoriquePuissanceProjetQuery,
  ListerHistoriquePuissanceProjetReadModel,
};

// UseCase
export type PuissanceUseCase =
  | ModifierPuissanceUseCase
  | DemanderChangementUseCase
  | AnnulerChangementPuissanceUseCase
  | EnregistrerChangementPuissanceUseCase
  | AccorderChangementPuissanceUseCase
  | RejeterChangementPuissanceUseCase;

export type { ChangementPuissanceAccordéEvent } from './changement/accorder/accorderChangementPuissance.event.js';
export type { ChangementPuissanceAnnuléEvent } from './changement/annuler/annulerChangementPuissance.event.js';
export type * from './changement/changementPuissance.entity.js';
export type { ChangementPuissanceDemandéEvent } from './changement/demander/demanderChangementPuissance.event.js';
export type { ChangementPuissanceEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangementPuissance.event.js';
export type { ChangementPuissanceRejetéEvent } from './changement/rejeter/rejeterChangementPuissance.event.js';
export type { ChangementPuissanceSuppriméEvent } from './changement/supprimer/supprimerChangementPuissance.event.js';
export type { PuissanceImportéeEvent } from './importer/importerPuissance.event.js';
export type { PuissanceModifiéeEvent } from './modifier/modifierPuissance.event.js';
// Entities
export type * from './puissance.entity.js';
// Event
export type { PuissanceEvent } from './puissance.event.js';
export * as AutoritéCompétente from './valueType/autoritéCompétente.valueType.js';
export * as DocumentPuissance from './valueType/documentPuissance.valueType.js';
export * as RatioChangementPuissance from './valueType/ratioChangementPuissance.valueType.js';
// ValueType
export * as StatutChangementPuissance from './valueType/statutChangementPuissance.valueType.js';
export * as VolumeRéservé from './valueType/volumeRéservé.valueType.js';
export type {
  AccorderChangementPuissanceUseCase,
  AnnulerChangementPuissanceUseCase,
  DemanderChangementUseCase,
  EnregistrerChangementPuissanceUseCase,
  ModifierPuissanceUseCase,
  RejeterChangementPuissanceUseCase,
};
