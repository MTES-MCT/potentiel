import {
  ConsulterPowerPurchaseAgreementQuery,
  ConsulterPowerPurchaseAgreementReadModel,
} from './consulter/consulterPowerPurchaseAgreement.query.js';
import {
  HistoriquePowerPurchaseAgreementProjetListItemReadModel,
  ListerHistoriquePowerPurchaseAgreementProjetQuery,
  ListerHistoriquePowerPurchaseAgreementProjetReadModel,
} from './listerHistorique/listerHistoriquePowerPurchaseAgreementProjet.query.js';
import { SignalerPowerPurchaseAgreementUseCase } from './signaler/signalerPowerPurchaseAgreement.usecase.js';

// Query
export type PowerPurchaseAgreementQuery =
  | ConsulterPowerPurchaseAgreementQuery
  | ListerHistoriquePowerPurchaseAgreementProjetQuery;
export type {
  ConsulterPowerPurchaseAgreementQuery,
  ListerHistoriquePowerPurchaseAgreementProjetQuery,
};

// ReadModel
export type {
  ConsulterPowerPurchaseAgreementReadModel,
  ListerHistoriquePowerPurchaseAgreementProjetReadModel,
  HistoriquePowerPurchaseAgreementProjetListItemReadModel,
};

// UseCases
export type PowerPurchaseAgreementUseCase = SignalerPowerPurchaseAgreementUseCase;
export type { SignalerPowerPurchaseAgreementUseCase };

// Event
export type { PowerPurchaseAgreementEvents } from './PowerPurchaseAgreement.events.js';
export type { PowerPurchaseAgreementSignaléEvent } from './signaler/PowerPurchaseAgreementSignalé.event.js';

// Register
export { registerPowerPurchaseAgreementUseCases } from './PowerPurchaseAgreement.register.js';

// Entities
export type * from './powerPurchaseAgreement.entity.js';
