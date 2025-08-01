import { BaseDomainEvent, DomainEvent } from '../../../core/domain';

export type ModificationRequestAcceptanceParams =
  | { type: 'recours'; newNotificationDate: Date }
  | { type: 'delai'; delayInMonths: number }
  | { type: 'puissance'; newPuissance: number; isDecisionJustice?: boolean }
  | { type: 'actionnaire'; newActionnaire: string }
  | { type: 'producteur'; newProducteur: string };

export interface ModificationRequestAcceptedPayload {
  modificationRequestId: string;
  params?: ModificationRequestAcceptanceParams | undefined;
  acceptedBy: string;
  responseFileId?: string;
}
export class ModificationRequestAccepted
  extends BaseDomainEvent<ModificationRequestAcceptedPayload>
  implements DomainEvent
{
  public static type: 'ModificationRequestAccepted' = 'ModificationRequestAccepted';
  public type = ModificationRequestAccepted.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: ModificationRequestAcceptedPayload) {
    return payload.modificationRequestId;
  }
}
