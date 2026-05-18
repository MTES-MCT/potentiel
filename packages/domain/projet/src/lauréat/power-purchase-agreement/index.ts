import type { AnnulerSignalementPowerPurchaseAgreementUseCase } from './annulerSignalement/annulerSignalementPowerPurchaseAgreement.usecase.js';
import type {
  ConsulterPowerPurchaseAgreementQuery,
  ConsulterPowerPurchaseAgreementReadModel,
} from './consulter/consulterPowerPurchaseAgreement.query.js';
import type {
  HistoriquePowerPurchaseAgreementProjetListItemReadModel,
  ListerHistoriquePowerPurchaseAgreementProjetQuery,
  ListerHistoriquePowerPurchaseAgreementProjetReadModel,
} from './listerHistorique/listerHistoriquePowerPurchaseAgreementProjet.query.js';
import type { SignalerPowerPurchaseAgreementUseCase } from './signaler/signalerPowerPurchaseAgreement.usecase.js';

// Query
export type PowerPurchaseAgreementQuery =
  | ConsulterPowerPurchaseAgreementQuery
  | ListerHistoriquePowerPurchaseAgreementProjetQuery;

// ReadModel
export type {
  ConsulterPowerPurchaseAgreementQuery,
  ConsulterPowerPurchaseAgreementReadModel,
  HistoriquePowerPurchaseAgreementProjetListItemReadModel,
  ListerHistoriquePowerPurchaseAgreementProjetQuery,
  ListerHistoriquePowerPurchaseAgreementProjetReadModel,
};

// UseCases
export type PowerPurchaseAgreementUseCase =
  | SignalerPowerPurchaseAgreementUseCase
  | AnnulerSignalementPowerPurchaseAgreementUseCase;

export type { SignalementPowerPurchaseAgreementAnnuléEvent } from './annulerSignalement/SignalementPowerPurchaseAgreementAnnulé.event.ts';
// Event
export type { PowerPurchaseAgreementEvents } from './PowerPurchaseAgreement.events.js';
// Register
export { registerPowerPurchaseAgreementUseCases } from './PowerPurchaseAgreement.register.js';
// Entities
export type * from './powerPurchaseAgreement.entity.js';
export type { PowerPurchaseAgreementSignaléEvent } from './signaler/PowerPurchaseAgreementSignalé.event.js';
export type {
  AnnulerSignalementPowerPurchaseAgreementUseCase,
  SignalerPowerPurchaseAgreementUseCase,
};
