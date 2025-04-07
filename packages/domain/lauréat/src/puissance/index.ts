import {
  ConsulterPuissanceQuery,
  ConsulterPuissanceReadModel,
} from './consulter/consulterPuissance.query';
import { DemanderChangementCommand } from './changement/demander/demanderChangementPuissance.command';
import { DemanderChangementUseCase } from './changement/demander/demanderChangementPuissance.usecase';
import { AccorderChangementPuissanceUseCase } from './changement/accorder/accorderChangementPuissance.usecase';
import { ImporterPuissanceCommand } from './importer/importerPuissance.command';
import { ModifierPuissanceCommand } from './modifier/modifierPuissance.command';
import { ModifierPuissanceUseCase } from './modifier/modifierPuissance.usecase';
import {
  ConsulterChangementPuissanceQuery,
  ConsulterChangementPuissanceReadModel,
} from './changement/consulter/consulterChangementPuissance.query';
import { AnnulerChangementPuissanceUseCase } from './changement/annuler/annulerChangementPuissance.usecase';
import { AnnulerChangementPuissanceCommand } from './changement/annuler/annulerChangementPuissance.command';
import { AccorderChangementPuissanceCommand } from './changement/accorder/accorderChangementPuissance.command';
import { EnregistrerChangementPuissanceCommand } from './changement/enregistrerChangement/enregistrerChangementPuissance.command';
import { EnregistrerChangementPuissanceUseCase } from './changement/enregistrerChangement/enregistrerChangementPuissance.usecase';
import { RejeterChangementPuissanceUseCase } from './changement/rejeter/rejeterChangementPuissance.usecase';
import { RejeterChangementPuissanceCommand } from './changement/rejeter/rejeterChangementPuissance.command';

// Query
export type PuissanceQuery = ConsulterPuissanceQuery | ConsulterChangementPuissanceQuery;
export type { ConsulterPuissanceQuery, ConsulterChangementPuissanceQuery };

// ReadModel
export type { ConsulterPuissanceReadModel, ConsulterChangementPuissanceReadModel };

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

// Command
export type PuissanceCommand =
  | ImporterPuissanceCommand
  | ModifierPuissanceCommand
  | DemanderChangementCommand
  | AnnulerChangementPuissanceCommand
  | AccorderChangementPuissanceCommand
  | EnregistrerChangementPuissanceCommand
  | RejeterChangementPuissanceCommand;

export type {
  ImporterPuissanceCommand,
  ModifierPuissanceCommand,
  DemanderChangementCommand,
  AnnulerChangementPuissanceCommand,
  AccorderChangementPuissanceCommand,
  EnregistrerChangementPuissanceCommand,
  RejeterChangementPuissanceCommand,
};

// Event
export type { PuissanceEvent } from './puissance.aggregate';
export type { PuissanceImportéeEvent } from './importer/importerPuissance.behavior';
export type { PuissanceModifiéeEvent } from './modifier/modifierPuissance.behavior';
export type { ChangementPuissanceDemandéEvent } from './changement/demander/demanderChangementPuissance.behavior';
export type { ChangementPuissanceAnnuléEvent } from './changement/annuler/annulerChangementPuissance.behavior';
export type { ChangementPuissanceSuppriméEvent } from './changement/supprimer/supprimerChangementPuissance.behavior';
export type { ChangementPuissanceEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangementPuissance.behavior';
export type { ChangementPuissanceAccordéEvent } from './changement/accorder/accorderChangementPuissance.behavior';
export type { ChangementPuissanceRejetéEvent } from './changement/rejeter/rejeterChangementPuissance.behavior';

// Entities
export * from './puissance.entity';
export * from './changement/changementPuissance.entity';

// ValueType
export * as StatutChangementPuissance from './valueType/statutChangementPuissance.valueType';
export * as TypeDocumentPuissance from './valueType/typeDocumentPuissance.valueType';
export * as RatioChangementPuissance from './valueType/ratioChangementPuissance.valueType';

// Saga
export * as PuissanceSaga from './saga';
