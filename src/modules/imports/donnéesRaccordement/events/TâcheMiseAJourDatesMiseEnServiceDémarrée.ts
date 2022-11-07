import { BaseDomainEvent, DomainEvent } from '@core/domain'
import ImportDonnéesRaccordementId from '../ImportDonnéesRaccordementId'

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
    return ImportDonnéesRaccordementId.format(payload.gestionnaire).toString()
  }
}
