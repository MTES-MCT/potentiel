import { BaseDomainEvent, DomainEvent } from '@core/domain'
import { DonnéesRaccordementFormatDatesISOString } from '../DonnéesRaccordement'
import ImportDonnéesRaccordementId from '../ImportDonnéesRaccordementId'

type Payload = {
  misAJourPar: string
  gestionnaire: string
  dates: DonnéesRaccordementFormatDatesISOString[]
}

export class TâcheMiseAJourDonnéesDeRaccordementDémarrée
  extends BaseDomainEvent<Payload>
  implements DomainEvent
{
  public static type: 'TâcheMiseAJourDonnéesDeRaccordementDémarrée' =
    'TâcheMiseAJourDonnéesDeRaccordementDémarrée'
  public type = TâcheMiseAJourDonnéesDeRaccordementDémarrée.type
  currentVersion = 1

  aggregateIdFromPayload(payload: Payload) {
    return ImportDonnéesRaccordementId.format(payload.gestionnaire).toString()
  }
}
