import type { SignalementPowerPurchaseAgreementAnnuléEvent } from './annulerSignalement/SignalementPowerPurchaseAgreementAnnulé.event.js';
import type { PowerPurchaseAgreementSignaléEvent } from './signaler/PowerPurchaseAgreementSignalé.event.js';

export type PowerPurchaseAgreementEvents =
  | PowerPurchaseAgreementSignaléEvent
  | SignalementPowerPurchaseAgreementAnnuléEvent;
