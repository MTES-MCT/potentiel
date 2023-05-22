import { Subscribe, Unsubscribe } from '@potentiel/core-domain';
import {
  gestionnaireRéseauAjoutéHandlerFactory,
  gestionnaireRéseauModifiéHandlerFactory,
  demandeComplèteRaccordementTransmiseHandlerFactory,
  propositionTechniqueEtFinancièreTransmiseHandlerFactory,
  demandeComplèteRaccordementeModifiéeHandlerFactory,
  propositionTechniqueEtFinancièreModifiéeHandlerFactory,
  accuséRéceptionDemandeComplèteRaccordementTransmisHandlerFactory,
  dateMiseEnServiceTransmiseHandlerFactory,
  gestionnaireRéseauProjetModifiéHandlerFactory,
} from '@potentiel/domain';
import { propositionTechniqueEtFinancièreSignéeTransmiseHandlerFactory } from '@potentiel/domain/src/raccordement/propositionTechniqueEtFinancière/enregistrerPropositionTechniqueEtFinancièreSignée/handlers/fichierPropositionTechniqueEtFinancièreTransmis.handler';
import { subscribe } from '@potentiel/pg-event-sourcing';
import {
  createProjection,
  updateProjection,
  findProjection,
  removeProjection,
} from '@potentiel/pg-projections';
import { publishToEventBus } from '@potentiel/redis-event-bus-client';
import { consumerFactory } from '@potentiel/redis-event-bus-consumer';
import {
  supprimerPropositionTechniqueEtFinancièreSignéeAdapter,
  téléchargerPropositionTechniqueEtFinancièreSignéeAdapter,
  téléverserPropositionTechniqueEtFinancièreSignéeAdapter,
} from '@potentiel/infra-adapters';

export const subscribeFactory = async (): Promise<Subscribe> => {
  const consumerGestionnaireRéseau = await consumerFactory('gestionnaireRéseauProjector');
  const consumerRaccordement = await consumerFactory('raccordementProjector');
  const consumerProjet = await consumerFactory('projetProjector');

  consumerGestionnaireRéseau.consume(
    'GestionnaireRéseauAjouté',
    gestionnaireRéseauAjoutéHandlerFactory({ create: createProjection }),
  );
  consumerGestionnaireRéseau.consume(
    'GestionnaireRéseauModifié',
    gestionnaireRéseauModifiéHandlerFactory({ update: updateProjection }),
  );
  consumerRaccordement.consume(
    'DemandeComplèteDeRaccordementTransmise',
    demandeComplèteRaccordementTransmiseHandlerFactory({
      create: createProjection,
      find: findProjection,
      update: updateProjection,
    }),
  );
  consumerRaccordement.consume(
    'DateMiseEnServiceTransmise',
    dateMiseEnServiceTransmiseHandlerFactory({ find: findProjection, update: updateProjection }),
  );
  consumerRaccordement.consume(
    'PropositionTechniqueEtFinancièreTransmise',
    propositionTechniqueEtFinancièreTransmiseHandlerFactory({
      find: findProjection,
      update: updateProjection,
    }),
  );
  consumerRaccordement.consume(
    'DemandeComplèteRaccordementModifiée',
    demandeComplèteRaccordementeModifiéeHandlerFactory({
      find: findProjection,
      create: createProjection,
      remove: removeProjection,
      update: updateProjection,
      enregistrerPropositionTechniqueEtFinancièreSignée:
        téléverserPropositionTechniqueEtFinancièreSignéeAdapter,
      récupérerPropositionTechniqueEtFinancièreSignée:
        téléchargerPropositionTechniqueEtFinancièreSignéeAdapter,
      supprimerPropositionTechniqueEtFinancièreSignée:
        supprimerPropositionTechniqueEtFinancièreSignéeAdapter,
    }),
  );
  consumerProjet.consume(
    'GestionnaireRéseauProjetModifié',
    gestionnaireRéseauProjetModifiéHandlerFactory({
      find: findProjection,
      create: createProjection,
      update: updateProjection,
    }),
  );
  consumerRaccordement.consume(
    'PropositionTechniqueEtFinancièreModifiée',
    propositionTechniqueEtFinancièreModifiéeHandlerFactory({
      find: findProjection,
      update: updateProjection,
    }),
  );
  consumerRaccordement.consume(
    'AccuséRéceptionDemandeComplèteRaccordementTransmis',
    accuséRéceptionDemandeComplèteRaccordementTransmisHandlerFactory({
      find: findProjection,
      update: updateProjection,
    }),
  );
  consumerRaccordement.consume(
    'PropositionTechniqueEtFinancièreSignéeTransmise',
    propositionTechniqueEtFinancièreSignéeTransmiseHandlerFactory({
      find: findProjection,
      update: updateProjection,
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
