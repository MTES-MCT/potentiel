import { DomainEvent, BaseDomainEvent } from '@core/domain'

export type DateDeMiseEnServiceAjoutéePayload = {
  utilisateurId: string
  nouvelleDateDeMiseEnService: string
  projetId: string
}

export class DateDeMiseEnServiceAjoutée
  extends BaseDomainEvent<DateDeMiseEnServiceAjoutéePayload>
  implements DomainEvent
{
  public static type: 'DateDeMiseEnServiceAjoutée' = 'DateDeMiseEnServiceAjoutée'
  public type = DateDeMiseEnServiceAjoutée.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DateDeMiseEnServiceAjoutéePayload) {
    return payload.projetId
  }
}
