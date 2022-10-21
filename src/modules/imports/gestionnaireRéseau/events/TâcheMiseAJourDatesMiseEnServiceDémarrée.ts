import { BaseDomainEvent, DomainEvent } from '@core/domain'
import ImportGestionnaireRéseauId from '../ImportGestionnaireRéseauId'

type TâcheMiseAJourDatesMiseEnServiceDémarréePayload = {
  misAJourPar: string
  gestionnaire: string
  dates: Array<{ identifiantGestionnaireRéseau: string; dateMiseEnService: string }>
}

export class TâcheMiseAJourDatesMiseEnServiceDémarrée
  extends BaseDomainEvent<TâcheMiseAJourDatesMiseEnServiceDémarréePayload>
  implements DomainEvent
{
  public static type: 'TâcheMiseAJourDatesMiseEnServiceDémarrée' =
    'TâcheMiseAJourDatesMiseEnServiceDémarrée'
  public type = TâcheMiseAJourDatesMiseEnServiceDémarrée.type
  currentVersion = 1

  aggregateIdFromPayload(payload: TâcheMiseAJourDatesMiseEnServiceDémarréePayload) {
    return ImportGestionnaireRéseauId.format(payload.gestionnaire).toString()
  }
}
