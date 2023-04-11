import { Create, DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { isNone, isSome } from '@potentiel/monads';
import { DemandeComplèteRaccordementTransmiseEvent } from '../demandeComplèteRaccordementTransmise.event';
import { GestionnaireRéseauReadModel } from '../../../../gestionnaireRéseau';
import { DemandeComplèteRaccordementReadModel } from '../../consulter/demandeComplèteRaccordement.readModel';
import { ListeDemandeComplèteRaccordementReadModel } from '../../lister/listeDemandeComplèteRaccordement.readModel';

export const demandeComplèteRaccordementTransmiseHandlerFactory: DomainEventHandlerFactory<
  DemandeComplèteRaccordementTransmiseEvent,
  {
    createDemandeComplèteRaccordement: Create<DemandeComplèteRaccordementReadModel>;
    createListeDemandeComplèteRaccordement: Create<ListeDemandeComplèteRaccordementReadModel>;
    updateListeDemandeComplèteRaccordement: Update<ListeDemandeComplèteRaccordementReadModel>;
    findGestionnaireRéseau: Find<GestionnaireRéseauReadModel>;
    findListeDemandeComplèteRaccordement: Find<ListeDemandeComplèteRaccordementReadModel>;
  }
> =
  ({
    createDemandeComplèteRaccordement,
    createListeDemandeComplèteRaccordement,
    updateListeDemandeComplèteRaccordement,
    findGestionnaireRéseau,
    findListeDemandeComplèteRaccordement,
  }) =>
  async (event) => {
    const gestionnaireRéseau = await findGestionnaireRéseau(
      `gestionnaire-réseau#${event.payload.identifiantGestionnaireRéseau}`,
    );

    if (isSome(gestionnaireRéseau)) {
      await createDemandeComplèteRaccordement(
        `demande-complète-raccordement#${event.payload.référenceDemandeRaccordement}`,
        {
          dateQualification: event.payload.dateQualification,
          référenceDemandeRaccordement: event.payload.référenceDemandeRaccordement,
          gestionnaireRéseau,
        },
      );

      const listeDemandeComplèteRaccordement = await findListeDemandeComplèteRaccordement(
        `liste-demande-complète-raccordement#${event.payload.identifiantProjet}`,
      );

      if (isNone(listeDemandeComplèteRaccordement)) {
        await createListeDemandeComplèteRaccordement(
          `liste-demande-complète-raccordement#${event.payload.identifiantProjet}`,
          {
            gestionnaireRéseau,
            référencesDemandeRaccordement: [event.payload.référenceDemandeRaccordement],
          },
        );
      } else {
        await updateListeDemandeComplèteRaccordement(
          `liste-demande-complète-raccordement#${event.payload.identifiantProjet}`,
          {
            ...listeDemandeComplèteRaccordement,
            référencesDemandeRaccordement: [
              ...listeDemandeComplèteRaccordement.référencesDemandeRaccordement,
              event.payload.référenceDemandeRaccordement,
            ],
          },
        );
      }
    } else {
      // TODO: logguer au cas où
    }
  };
