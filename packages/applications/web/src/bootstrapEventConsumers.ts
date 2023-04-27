import {
  gestionnaireRéseauAjoutéHandlerFactory,
  gestionnaireRéseauModifiéHandlerFactory,
  demandeComplèteRaccordementTransmiseHandlerFactory,
  dateMiseEnServiceTransmiseHandlerFactory,
  propositionTechniqueEtFinancièreTransmiseHandlerFactory,
} from '@potentiel/domain';
import { demandeComplèteRaccordementeModifiéeHandlerFactory } from '@potentiel/domain/src/raccordement/modifierDemandeComplèteRaccordement/handlers/demandeComplèteRaccordementModifiée.handler';
import {
  createProjection,
  updateProjection,
  findProjection,
  removeProjection,
} from '@potentiel/pg-projections';
import { consumerFactory } from '@potentiel/redis-event-bus-consumer';

export async function bootstrapEventConsumers() {
  const consumerGestionnaireRéseau = await consumerFactory('gestionnaireRéseauProjector');
  const consumerRaccordement = await consumerFactory('raccordementProjector');
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
    }),
  );
}
