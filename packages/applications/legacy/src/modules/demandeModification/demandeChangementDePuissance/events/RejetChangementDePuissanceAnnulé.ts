import { BaseDomainEvent, DomainEvent } from '../../../../core/domain';

export type RejetChangementDePuissanceAnnuléPayload = {
  demandeChangementDePuissanceId: string;
  projetId: string;
  annuléPar: string;
};

export class RejetChangementDePuissanceAnnulé
  extends BaseDomainEvent<RejetChangementDePuissanceAnnuléPayload>
  implements DomainEvent
{
  public static type: 'RejetChangementDePuissanceAnnulé' = 'RejetChangementDePuissanceAnnulé';
  public type = RejetChangementDePuissanceAnnulé.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: RejetChangementDePuissanceAnnuléPayload) {
    return payload.demandeChangementDePuissanceId;
  }
}
