import { BaseDomainEvent, DomainEvent } from '@core/domain'
import ImportGestionnaireRéseauId from '../ImportGestionnaireRéseauId'

type MiseAJourDateMiseEnServiceTerminéePayload = {
  gestionnaire: string
}

export class MiseAJourDateMiseEnServiceTerminée
  extends BaseDomainEvent<MiseAJourDateMiseEnServiceTerminéePayload>
  implements DomainEvent
{
  public static type: 'MiseAJourDateMiseEnServiceTerminée' = 'MiseAJourDateMiseEnServiceTerminée'
  public type = MiseAJourDateMiseEnServiceTerminée.type
  currentVersion = 1

  aggregateIdFromPayload(payload: MiseAJourDateMiseEnServiceTerminéePayload) {
    return ImportGestionnaireRéseauId.format(payload.gestionnaire).toString()
  }
}
