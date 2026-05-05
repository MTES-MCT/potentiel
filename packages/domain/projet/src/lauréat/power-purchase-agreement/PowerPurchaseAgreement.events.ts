import { PowerPurchaseAgreementAnnuléEvent } from './annuler/PowerPurchaseAgreementAnnulé.event.js';
import { PowerPurchaseAgreementSignaléEvent } from './signaler/PowerPurchaseAgreementSignalé.event.js';

export type PowerPurchaseAgreementEvents =
  | PowerPurchaseAgreementSignaléEvent
  | PowerPurchaseAgreementAnnuléEvent;
