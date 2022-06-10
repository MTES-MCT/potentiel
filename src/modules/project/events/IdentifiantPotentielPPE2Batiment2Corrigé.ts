import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

export interface IdentifiantPotentielPPE2Batiment2CorrigéPayload {
  projectId: string
  nouvelIdentifiant: string
}
export class IdentifiantPotentielPPE2Batiment2Corrigé
  extends BaseDomainEvent<IdentifiantPotentielPPE2Batiment2CorrigéPayload>
  implements DomainEvent
{
  public static type: 'IdentifiantPotentielPPE2Batiment2Corrigé' =
    'IdentifiantPotentielPPE2Batiment2Corrigé'
  public type = IdentifiantPotentielPPE2Batiment2Corrigé.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<IdentifiantPotentielPPE2Batiment2CorrigéPayload>) {
    super(props)
  }

  aggregateIdFromPayload(payload: IdentifiantPotentielPPE2Batiment2CorrigéPayload) {
    return payload.projectId
  }
}
