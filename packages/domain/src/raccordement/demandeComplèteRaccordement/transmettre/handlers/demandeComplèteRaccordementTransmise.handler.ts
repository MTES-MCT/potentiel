import { Create, DomainEventHandlerFactory, Find } from '@potentiel/core-domain';
import { isSome } from '@potentiel/monads';
import { DemandeComplèteRaccordementTransmiseEvent } from '../demandeComplèteRaccordementTransmise.event';
import { GestionnaireRéseauReadModel } from '../../../../gestionnaireRéseau';
import { DemandeComplèteRaccordementReadModel } from '../../consulter/demandeComplèteRaccordement.readModel';

export const demandeComplèteRaccordementTransmiseHandlerFactory: DomainEventHandlerFactory<
  DemandeComplèteRaccordementTransmiseEvent,
  {
    create: Create<DemandeComplèteRaccordementReadModel>;
    find: Find<GestionnaireRéseauReadModel>;
  }
> =
  ({ create, find }) =>
  async (event) => {
    const gestionnaireRéseau = await find(
      `gestionnaire-réseau#${event.payload.identifiantGestionnaireRéseau}`,
    );

    if (isSome(gestionnaireRéseau)) {
      await create(`demande-complète-raccordement#${event.payload.référenceDemandeRaccordement}`, {
        dateQualification: event.payload.dateQualification,
        référenceDemandeRaccordement: event.payload.référenceDemandeRaccordement,
        gestionnaireRéseau,
      });
    } else {
      // TODO: logguer au cas où
    }
  };
