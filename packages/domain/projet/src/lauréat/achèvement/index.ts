import type { DonnéesProjetPourAchèvementReadModel } from './_helpers/donnéesProjetPourAchèvement.js';
import type {
  ConsulterAchèvementAchevéReadModel,
  ConsulterAchèvementQuery,
  ConsulterAchèvementReadModel,
} from './consulter/consulterAchèvement.query.js';
import type { ConsulterDonnéesProjetPourAchèvementQuery } from './consulter/consulterDonnéesProjetPourAchèvement.query.js';
import type { CorrigerDateAchèvementUseCase } from './corriger/corrigerDateAchèvement.usecase.js';
import type { EnregistrerAttestationConformitéUseCase } from './enregistrer/enregistrerAttestationConformité.usecase.js';
import type { InitierAchèvementUseCase } from './initier/initierAchèvement.usecase.js';
import type {
  ListerProjetAvecAchèvementÀTransmettreQuery,
  ListerProjetAvecAchèvementÀTransmettreReadModel,
} from './lister/listerProjetAvecAchèvementÀTransmettre.query.js';
import type {
  ListerProjetsEnAttenteDAchèvementQuery,
  ListerProjetsEnAttenteDAchèvementReadModel,
} from './lister/listerProjetsEnAttenteDAchèvement.query.js';
import type { ModifierAchèvementUseCase } from './modifier/modifierAchèvement.usecase.js';
import type { ModifierAttestationConformitéUseCase } from './modifier/modifierAttestationConformité.usecase.js';
import type { TransmettreAttestationConformitéUseCase } from './transmettre/transmettreAttestationConformité.usecase.js';
import type { TransmettreDateAchèvementUseCase } from './transmettre/transmettreDateAchèvement.usecase.js';

export type {
  CorrigerDateAchèvementUseCase,
  EnregistrerAttestationConformitéUseCase,
  InitierAchèvementUseCase,
  ModifierAchèvementUseCase,
  ModifierAttestationConformitéUseCase,
  TransmettreAttestationConformitéUseCase,
  TransmettreDateAchèvementUseCase,
};

// Query
export type AchèvementQuery =
  | ConsulterAchèvementQuery
  | ConsulterDonnéesProjetPourAchèvementQuery
  | ListerProjetAvecAchèvementÀTransmettreQuery
  | ListerProjetsEnAttenteDAchèvementQuery;

// Entity
export type { AchèvementEntity } from './achèvement.entity.js';
// Errors
export { DateAchèvementAntérieureÀDateNotificationError } from './achèvement.error.js';
// Event
export type * from './achèvement.event.js';
// ValueTypes
export * as DateAchèvementPrévisionnel from './dateAchèvementPrévisionnel.valueType.js';
export * as DocumentAchèvement from './documentAchèvement.valueType.js';
export * as TypeTâchePlanifiéeAchèvement from './typeTâchePlanifiéeAchèvement.valueType.js';
// ReadModel
export type {
  ConsulterAchèvementAchevéReadModel,
  ConsulterAchèvementQuery,
  ConsulterAchèvementReadModel,
  ConsulterDonnéesProjetPourAchèvementQuery,
  DonnéesProjetPourAchèvementReadModel,
  ListerProjetAvecAchèvementÀTransmettreQuery,
  ListerProjetAvecAchèvementÀTransmettreReadModel,
  ListerProjetsEnAttenteDAchèvementQuery,
  ListerProjetsEnAttenteDAchèvementReadModel,
};
