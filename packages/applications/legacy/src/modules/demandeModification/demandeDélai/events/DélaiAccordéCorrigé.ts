import { BaseDomainEvent, DomainEvent } from '../../../../core/domain';

type Payload = {
  projectLegacyId: string;
  identifiantProjet: string;
  demandeDélaiId: string;
  ancienneDateThéoriqueAchèvement: string;
  dateAchèvementAccordée: string;
  corrigéPar: string;
  fichierRéponseId: string;
  explications?: string;
};

export class DélaiAccordéCorrigé extends BaseDomainEvent<Payload> implements DomainEvent {
  public static type: 'DélaiAccordéCorrigé' = 'DélaiAccordéCorrigé';
  public type = DélaiAccordéCorrigé.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: Payload) {
    return payload.demandeDélaiId;
  }
}
