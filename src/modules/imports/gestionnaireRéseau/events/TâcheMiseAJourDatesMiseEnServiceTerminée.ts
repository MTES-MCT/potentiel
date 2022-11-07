import { BaseDomainEvent, DomainEvent } from '@core/domain'
import ImportGestionnaireRéseauId from '../ImportGestionnaireRéseauId'

type TâcheMiseAJourDatesMiseEnServiceTerminéePayload = {
  gestionnaire: string
  résultat: Array<
    {
      identifiantGestionnaireRéseau: string
    } & (
      | {
          état: 'succès'
          projetId: string
        }
      | {
          état: 'ignoré'
          raison: string
          projetId: string
        }
      | {
          état: 'échec'
          raison: string
          projetId?: string
        }
    )
  >
}

export class TâcheMiseAJourDatesMiseEnServiceTerminée
  extends BaseDomainEvent<TâcheMiseAJourDatesMiseEnServiceTerminéePayload>
  implements DomainEvent
{
  public static type: 'TâcheMiseAJourDatesMiseEnServiceTerminée' =
    'TâcheMiseAJourDatesMiseEnServiceTerminée'
  public type = TâcheMiseAJourDatesMiseEnServiceTerminée.type
  currentVersion = 1

  aggregateIdFromPayload(payload: TâcheMiseAJourDatesMiseEnServiceTerminéePayload) {
    return ImportGestionnaireRéseauId.format(payload.gestionnaire).toString()
  }
}
