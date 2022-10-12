import { BaseDomainEvent, DomainEvent } from '@core/domain'
import ImportGestionnaireRéseauId from '../ImportGestionnaireRéseauId'

type MiseAJourDateMiseEnServiceDémarréePayload = {
  gestionnaire: string
  dates: Array<{ numeroGestionnaire: string; dateMiseEnService: string }>
}

export class MiseAJourDateMiseEnServiceDémarrée
  extends BaseDomainEvent<MiseAJourDateMiseEnServiceDémarréePayload>
  implements DomainEvent
{
  public static type: 'MiseAJourDateMiseEnServiceDémarrée' = 'MiseAJourDateMiseEnServiceDémarrée'
  public type = MiseAJourDateMiseEnServiceDémarrée.type
  currentVersion = 1

  aggregateIdFromPayload(payload: MiseAJourDateMiseEnServiceDémarréePayload) {
    return ImportGestionnaireRéseauId.format(payload.gestionnaire).toString()
  }
}
