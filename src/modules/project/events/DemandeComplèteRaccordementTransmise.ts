import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '../../../core/domain';

/**
 * @deprecated à bouger dans la nouvelle app
 */
type Payload = {
  référenceDossierRaccordement: string;
  identifiantProjet: string;
  identifiantGestionnaireRéseau: string;
  dateQualification?: string;
};

/**
 * @deprecated à bouger dans la nouvelle app
 */
export class DemandeComplèteRaccordementTransmise
  extends BaseDomainEvent<Payload>
  implements DomainEvent
{
  public static type: 'DemandeComplèteRaccordementTransmise' =
    'DemandeComplèteRaccordementTransmise';
  public type = DemandeComplèteRaccordementTransmise.type;
  currentVersion = 1;

  constructor(props: BaseDomainEventProps<Payload>) {
    super(props);
  }

  aggregateIdFromPayload(payload: Payload) {
    return payload.identifiantProjet;
  }
}
