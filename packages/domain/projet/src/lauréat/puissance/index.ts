import {
  ConsulterPuissanceQuery,
  ConsulterPuissanceReadModel,
} from './consulter/consulterPuissance.query';
import { DemanderChangementUseCase } from './changement/demander/demanderChangementPuissance.usecase';
import { AccorderChangementPuissanceUseCase } from './changement/accorder/accorderChangementPuissance.usecase';
import { ModifierPuissanceUseCase } from './modifier/modifierPuissance.usecase';
import {
  ConsulterChangementPuissanceQuery,
  ConsulterChangementPuissanceReadModel,
} from './changement/consulter/consulterChangementPuissance.query';
import { AnnulerChangementPuissanceUseCase } from './changement/annuler/annulerChangementPuissance.usecase';
import { EnregistrerChangementPuissanceUseCase } from './changement/enregistrerChangement/enregistrerChangementPuissance.usecase';
import { RejeterChangementPuissanceUseCase } from './changement/rejeter/rejeterChangementPuissance.usecase';
import {
  ListerChangementPuissanceQuery,
  ListerChangementPuissanceReadModel,
} from './changement/lister/listerChangementPuissance.query';
import {
  ListerHistoriquePuissanceProjetQuery,
  HistoriquePuissanceProjetListItemReadModel,
  ListerHistoriquePuissanceProjetReadModel,
} from './listerHistorique/listerHistoriquePuissanceProjet.query';
import {
  ConsulterVolumeRéservéReadModel,
  ConsulterVolumeRéservéQuery,
} from './consulter/consulterVolumeRéservé.query';
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
export type { PuissanceEvent } from './puissance.event';
export type { PuissanceImportéeEvent } from './importer/importerPuissance.event';
export type { PuissanceModifiéeEvent } from './modifier/modifierPuissance.event';
export type { ChangementPuissanceDemandéEvent } from './changement/demander/demanderChangementPuissance.event';
export type { ChangementPuissanceAnnuléEvent } from './changement/annuler/annulerChangementPuissance.event';
export type { ChangementPuissanceSuppriméEvent } from './changement/supprimer/supprimerChangementPuissance.event';
export type { ChangementPuissanceEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangementPuissance.event';
export type { ChangementPuissanceAccordéEvent } from './changement/accorder/accorderChangementPuissance.event';
export type { ChangementPuissanceRejetéEvent } from './changement/rejeter/rejeterChangementPuissance.event';

// Entities
export * from './puissance.entity';
export * from './changement/changementPuissance.entity';

// ValueType
export * as StatutChangementPuissance from './valueType/statutChangementPuissance.valueType';
export * as TypeDocumentPuissance from './valueType/typeDocumentPuissance.valueType';
export * as RatioChangementPuissance from './valueType/ratioChangementPuissance.valueType';
export * as AutoritéCompétente from './valueType/autoritéCompétente.valueType';
export * as VolumeRéservé from './valueType/volumeRéservé.valueType';
