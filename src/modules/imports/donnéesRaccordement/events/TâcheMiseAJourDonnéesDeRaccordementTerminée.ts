import { BaseDomainEvent, DomainEvent } from '@core/domain';
import ImportDonnéesRaccordementId from '../ImportDonnéesRaccordementId';

type Payload = {
  gestionnaire: string;
  résultat: Array<
    {
      identifiantGestionnaireRéseau: string;
    } & (
      | {
          état: 'succès';
          projetId: string;
        }
      | {
          état: 'ignoré';
          raison: string;
          projetId: string;
        }
      | {
          état: 'échec';
          raison: string;
          projetId?: string;
        }
    )
  >;
};

export class TâcheMiseAJourDonnéesDeRaccordementTerminée
  extends BaseDomainEvent<Payload>
  implements DomainEvent
{
  public static type: 'TâcheMiseAJourDonnéesDeRaccordementTerminée' =
    'TâcheMiseAJourDonnéesDeRaccordementTerminée';
  public type = TâcheMiseAJourDonnéesDeRaccordementTerminée.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: Payload) {
    return ImportDonnéesRaccordementId.format(payload.gestionnaire).toString();
  }
}
