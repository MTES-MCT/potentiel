import { Subscribe } from '@potentiel/core-domain';
import {
  ConsulterAccuséRéceptionDemandeComplèteRaccordementDependencies,
  registerConsulterAccuséRéceptionDemandeComplèteRaccordementQuery,
} from './consulter/consulterAccuséRéceptionDemandeComplèteRaccordement.query';
import {
  ConsulterDossierRaccordementDependencies,
  registerConsulterDossierRaccordementQuery,
} from './consulter/consulterDossierRaccordement.query';
import {
  ConsulterPropositionTechniqueEtFinancièreSignéeDependencies,
  registerConsulterPropositionTechniqueEtFinancièreSignéeQuery,
} from './consulter/consulterPropositionTechniqueEtFinancièreSignée.query';
import {
  ListerDossiersRaccordementQueryDependencies,
  registerListerDossiersRaccordementQuery,
} from './lister/listerDossierRaccordement.query';
import {
  RechercherDossierRaccordementDependencies,
  registerRechercherDossierRaccordementQuery,
} from './rechercher/rechercherDossierRaccordement.query';
import {
  ExecuteRaccordementProjector,
  RaccordementProjectorDependencies,
  registerRaccordementProjector,
} from './raccordement.projector';
import { RaccordementEvent } from '@potentiel/domain';
import { mediator } from 'mediateur';

// Setup
type RaccordementQueryDependencies = ConsulterDossierRaccordementDependencies &
  ConsulterAccuséRéceptionDemandeComplèteRaccordementDependencies &
  ConsulterPropositionTechniqueEtFinancièreSignéeDependencies &
  RechercherDossierRaccordementDependencies &
  ListerDossiersRaccordementQueryDependencies &
  RaccordementProjectorDependencies;

export type RaccordementDependencies = {
  subscribe: Subscribe;
} & RaccordementQueryDependencies;

export const setupRaccordementViews = async (dependencies: RaccordementDependencies) => {
  // Queries
  registerConsulterAccuséRéceptionDemandeComplèteRaccordementQuery(dependencies);
  registerConsulterDossierRaccordementQuery(dependencies);
  registerConsulterPropositionTechniqueEtFinancièreSignéeQuery(dependencies);
  registerListerDossiersRaccordementQuery(dependencies);
  registerRechercherDossierRaccordementQuery(dependencies);

  // Projector
  registerRaccordementProjector(dependencies);

  // Subscribes
  const { subscribe } = dependencies;

  return [
    await subscribe<RaccordementEvent>({
      name: 'raccordement_projector',
      eventType: [
        'AccuséRéceptionDemandeComplèteRaccordementTransmis',
        'DateMiseEnServiceTransmise',
        'DemandeComplèteDeRaccordementTransmise',
        'DemandeComplèteRaccordementModifiée',
        'DemandeComplèteRaccordementModifiée-V1',
        'PropositionTechniqueEtFinancièreModifiée',
        'PropositionTechniqueEtFinancièreSignéeTransmise',
        'PropositionTechniqueEtFinancièreTransmise',
        'RéférenceDossierRacordementModifiée-V1',
      ],
      eventHandler: async (event: RaccordementEvent) => {
        await mediator.publish<ExecuteRaccordementProjector>({
          type: 'EXECUTE_RACCORDEMENT_PROJECTOR',
          data: event,
        });
      },
    }),
  ];
};
