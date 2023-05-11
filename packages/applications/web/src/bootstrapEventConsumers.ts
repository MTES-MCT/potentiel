import {
  gestionnaireRéseauAjoutéHandlerFactory,
  gestionnaireRéseauModifiéHandlerFactory,
  demandeComplèteRaccordementTransmiseHandlerFactory,
  dateMiseEnServiceTransmiseHandlerFactory,
  propositionTechniqueEtFinancièreTransmiseHandlerFactory,
  gestionnaireRéseauProjetModifiéHandlerFactory,
  demandeComplèteRaccordementeModifiéeHandlerFactory,
  propositionTechniqueEtFinancièreModifiéeHandlerFactory,
  accuséRéceptionDemandeComplèteRaccordementTransmisHandlerFactory,
} from '@potentiel/domain';
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
}
