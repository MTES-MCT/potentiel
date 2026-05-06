import { SignalementPowerPurchaseAgreementAnnuléEvent } from './annulerSignalement/SignalementPowerPurchaseAgreementAnnulé.event.js';
import { PowerPurchaseAgreementSignaléEvent } from './signaler/PowerPurchaseAgreementSignalé.event.js';

export type PowerPurchaseAgreementEvents =
  | PowerPurchaseAgreementSignaléEvent
  | SignalementPowerPurchaseAgreementAnnuléEvent;
