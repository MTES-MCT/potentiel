import { BaseDomainEvent, DomainEvent } from '@core/domain'
import ImportDonnéesRaccordementId from '../ImportDonnéesRaccordementId'

type Payload = {
  misAJourPar: string
  gestionnaire: string
  dates: ({ identifiantGestionnaireRéseau: string } & (
    | { dateMiseEnService: string; dateFileAttente: string }
    | { dateMiseEnService: string }
    | { dateFileAttente: string }
  ))[]
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
