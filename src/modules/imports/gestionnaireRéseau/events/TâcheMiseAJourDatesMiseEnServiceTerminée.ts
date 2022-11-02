import { BaseDomainEvent, DomainEvent } from '@core/domain'
import ImportGestionnaireRéseauId from '../ImportGestionnaireRéseauId'

export type RésultatTâcheMaJMeS = Array<
  {
    identifiantGestionnaireRéseau: string
  } & (
    | {
        état: 'succès'
        projetId: string
      }
    | {
        état: 'échec' | 'ignoré'
        raison: string
        projetId?: string
      }
  )
>

type TâcheMiseAJourDatesMiseEnServiceTerminéePayload = {
  gestionnaire: string
  résultat: RésultatTâcheMaJMeS
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
