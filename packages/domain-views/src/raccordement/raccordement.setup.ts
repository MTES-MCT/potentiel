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
import { RebuildTriggered } from '@potentiel/core-domain-views';

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
    await subscribe({
      name: 'projector',
      eventType: [
        'AccuséRéceptionDemandeComplèteRaccordementTransmis-V1',
        'DateMiseEnServiceTransmise-V1',
        'DemandeComplèteDeRaccordementTransmise-V1',
        'DemandeComplèteRaccordementModifiée-V1',
        'DemandeComplèteRaccordementModifiée-V2',
        'PropositionTechniqueEtFinancièreModifiée-V1',
        'PropositionTechniqueEtFinancièreSignéeTransmise-V1',
        'PropositionTechniqueEtFinancièreTransmise-V1',
        'RéférenceDossierRacordementModifiée-V1',
        'RebuildTriggered',
      ],
      eventHandler: async (event: RaccordementEvent | RebuildTriggered) => {
        await mediator.publish<ExecuteRaccordementProjector>({
          type: 'EXECUTE_RACCORDEMENT_PROJECTOR',
          data: event,
        });
      },
      streamCategory: 'raccordement',
    }),
  ];
};
