import { Subscribe, Unsubscribe } from '@potentiel/core-domain';
import { RaccordementEvent } from '@potentiel/domain';
import {
  ExecuteGestionnaireRéseauProjector,
  ExecuteProjetProjector,
  ExecuteRaccordementProjector,
} from '@potentiel/domain-views';
import {
  GestionnaireRéseauEvent,
} from '@potentiel/domain/src/gestionnaireRéseau/gestionnaireRéseau.event';
import {
  ProjetEvent,
} from '@potentiel/domain/src/projet/projet.event';
import { subscribe } from '@potentiel/pg-event-sourcing';


import { publishToEventBus } from '@potentiel/redis-event-bus-client';
import { consumerFactory } from '@potentiel/redis-event-bus-consumer';
import { mediator } from 'mediateur';

export const subscribeFactory = async (): Promise<Subscribe> => {
  const consumerGestionnaireRéseau = await consumerFactory('gestionnaireRéseauProjector');

  consumerGestionnaireRéseau.consume('GestionnaireRéseauAjouté', (event: GestionnaireRéseauEvent) =>
    mediator.send<ExecuteGestionnaireRéseauProjector>({
      type: 'EXECUTE_GESTIONNAIRE_RÉSEAU_PROJECTOR',
      data: event,
    }),
  );
  consumerGestionnaireRéseau.consume(
    'GestionnaireRéseauModifié',
    (event: GestionnaireRéseauEvent) =>
      mediator.send<ExecuteGestionnaireRéseauProjector>({
        type: 'EXECUTE_GESTIONNAIRE_RÉSEAU_PROJECTOR',
        data: event,
      }),
  );

  const consumerProjet = await consumerFactory('projetProjector');

  consumerProjet.consume('GestionnaireRéseauProjetAjouté', (event: ProjetEvent) =>
    mediator.send<ExecuteProjetProjector>({
      type: 'EXECUTE_PROJET_PROJECTOR',
      data: event,
    }),
  );

  consumerProjet.consume('GestionnaireRéseauProjetModifié', (event: ProjetEvent) =>
    mediator.send<ExecuteProjetProjector>({
      type: 'EXECUTE_PROJET_PROJECTOR',
      data: event,
    }),
  );

  const consumerRaccordement = await consumerFactory('raccordementProjector');

  consumerRaccordement.consume(
    'AccuséRéceptionDemandeComplèteRaccordementTransmis',
    (event: RaccordementEvent) =>
      mediator.send<ExecuteRaccordementProjector>({
        type: 'EXECUTE_RACCORDEMENT_PROJECTOR',
        data: event,
      }),
  );
  consumerRaccordement.consume('DateMiseEnServiceTransmise', (event: RaccordementEvent) =>
    mediator.send<ExecuteRaccordementProjector>({
      type: 'EXECUTE_RACCORDEMENT_PROJECTOR',
      data: event,
    }),
  );

  consumerRaccordement.consume(
    'DemandeComplèteDeRaccordementTransmise',
    (event: RaccordementEvent) =>
      mediator.send<ExecuteRaccordementProjector>({
        type: 'EXECUTE_RACCORDEMENT_PROJECTOR',
        data: event,
      }),
  );

  consumerRaccordement.consume('DemandeComplèteRaccordementModifiée', (event: RaccordementEvent) =>
    mediator.send<ExecuteRaccordementProjector>({
      type: 'EXECUTE_RACCORDEMENT_PROJECTOR',
      data: event,
    }),
  );

  consumerRaccordement.consume(
    'DemandeComplèteRaccordementModifiée-V1',
    (event: RaccordementEvent) =>
      mediator.send<ExecuteRaccordementProjector>({
        type: 'EXECUTE_RACCORDEMENT_PROJECTOR',
        data: event,
      }),
  );

  consumerRaccordement.consume(
    'PropositionTechniqueEtFinancièreModifiée',
    (event: RaccordementEvent) =>
      mediator.send<ExecuteRaccordementProjector>({
        type: 'EXECUTE_RACCORDEMENT_PROJECTOR',
        data: event,
      }),
  );

  consumerRaccordement.consume(
    'PropositionTechniqueEtFinancièreSignéeTransmise',
    (event: RaccordementEvent) =>
      mediator.send<ExecuteRaccordementProjector>({
        type: 'EXECUTE_RACCORDEMENT_PROJECTOR',
        data: event,
      }),
  );

  consumerRaccordement.consume(
    'PropositionTechniqueEtFinancièreTransmise',
    (event: RaccordementEvent) =>
      mediator.send<ExecuteRaccordementProjector>({
        type: 'EXECUTE_RACCORDEMENT_PROJECTOR',
        data: event,
      }),
  );

  consumerRaccordement.consume(
    'RéférenceDossierRacordementModifiée-V1',
    (event: RaccordementEvent) =>
      mediator.send<ExecuteRaccordementProjector>({
        type: 'EXECUTE_RACCORDEMENT_PROJECTOR',
        data: event,
      }),
  );

  let unsubscribe: Unsubscribe | undefined;

  return () => {
    if (!unsubscribe) {
      unsubscribe = subscribe('all', async (event) => {
        await publishToEventBus(event.type, event);
      });
    }

    return unsubscribe;
  };
};
