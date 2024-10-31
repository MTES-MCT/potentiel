import { LoadAggregate } from '@potentiel-domain/core';

import { registerModifierDemandeComplèteRaccordementUseCase } from './modifier/modifierDemandeComplèteRaccordement.usecase';
import { registerModifierGestionnaireRéseauRaccordementUseCase } from './modifier/modifierGestionnaireRéseauRaccordement.usecase';
import { registerModifierPropositiontechniqueEtFinancièreUseCase } from './modifier/modifierPropositiontechniqueEtFinancière.usecase';
import { registerModifierRéférenceDossierRaccordementUseCase } from './modifier/modifierRéférenceDossierRaccordement.usecase';
import { registerTransmettreDateMiseEnServiceUseCase } from './transmettre/transmettreDateMiseEnService.usecase';
import { registerTransmettreDemandeComplèteRaccordementUseCase } from './transmettre/transmettreDemandeComplèteRaccordement.usecase';
import { registerTransmettrePropositionTechniqueEtFinancièreUseCase } from './transmettre/transmettrePropositionTechniqueEtFinancière.usecase';
import { registerModifierDemandeComplèteRaccordementCommand } from './modifier/modifierDemandeComplèteRaccordement.command';
import { registerModifierGestionnaireRéseauProjetCommand } from './modifier/modifierGestionnaireRéseauRaccordement.command';
import { registerModifierPropositionTechniqueEtFinancièreCommand } from './modifier/modifierPropositiontechniqueEtFinancière.command';
import { registerModifierRéférenceDossierRaccordementCommand } from './modifier/modifierRéférenceDossierRaccordement.command';
import { registerTransmettreDateMiseEnServiceCommand } from './transmettre/transmettreDateMiseEnService.command';
import { registerTransmettreDemandeComplèteRaccordementCommand } from './transmettre/transmettreDemandeComplèteRaccordement.command';
import { registerTransmettrePropositionTechniqueEtFinancièreCommand } from './transmettre/transmettrePropositionTechniqueEtFinancière.command';
import {
  ConsulterDossierRaccordementDependencies,
  registerConsulterDossierRaccordementQuery,
} from './consulter/consulterDossierRaccordement.query';
import {
  ConsulterRaccordementDependencies,
  registerConsulterRaccordementQuery,
} from './consulter/consulterRaccordement.query';
import {
  RechercherDossierRaccordementDependencies,
  registerRechercherDossierRaccordementQuery,
} from './rechercher/rechercherDossierRaccordement.query';
import {
  ConsulterGestionnaireRéseauRaccordementDependencies,
  registerConsulterGestionnaireRéseauRaccordementQuery,
} from './consulter/consulterGestionnaireRéseauRaccordement.query';
import {
  registerListerRaccordementQuery,
  ListerRaccordementQueryDependencies,
} from './lister/listerRaccordement.query';
import { registerAttribuerGestionnaireRéseauUseCase } from './attribuer/attribuerGestionnaireRéseau.usecase';
import { registerAttribuerGestionnaireCommand } from './attribuer/attribuerGestionnaireRéseau.command';
import {
  ConsulterNombreDeRaccordementDependencies,
  registerConsulterNombreDeRaccordementQuery,
} from './consulter/consulterNombreRaccordement';
import { registerSupprimerDossierDuRaccordementUseCase } from './dossier/supprimer/supprimerDossierDuRaccordement.usecase';
import { registerSupprimerDossierDuRaccordementCommand } from './dossier/supprimer/supprimerDossierDuRaccordement.command';
import { registerSupprimerRaccordementCommand } from './supprimer/supprimerRaccordement.command';
import { registerListerDossierRaccordementEnAttenteMiseEnServiceQuery } from './lister/listerDossierRaccordementEnAttenteMiseEnService.query';
import { registerListerDossierRaccordementQuery } from './lister/listerDossierRaccordement.query';
import { registerModifierDateMiseEnServiceCommand } from './modifier/modifierDateMiseEnService.command';
import { registerModifierDateMiseEnServiceUseCase } from './modifier/modifierDateMiseEnService.usecase';

export type RaccordementQueryDependencies = ConsulterDossierRaccordementDependencies &
  ConsulterGestionnaireRéseauRaccordementDependencies &
  ConsulterRaccordementDependencies &
  ConsulterNombreDeRaccordementDependencies &
  RechercherDossierRaccordementDependencies &
  ListerRaccordementQueryDependencies;

export type RaccordementCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerRaccordementQueries = (dependencies: RaccordementQueryDependencies) => {
  registerConsulterDossierRaccordementQuery(dependencies);
  registerConsulterGestionnaireRéseauRaccordementQuery(dependencies);
  registerConsulterNombreDeRaccordementQuery(dependencies);
  registerConsulterRaccordementQuery(dependencies);
  registerRechercherDossierRaccordementQuery(dependencies);
  registerListerRaccordementQuery(dependencies);
  registerListerDossierRaccordementEnAttenteMiseEnServiceQuery(dependencies);
  registerListerDossierRaccordementQuery(dependencies);
};

export const registerRaccordementUseCases = ({
  loadAggregate,
}: RaccordementCommandDependencies) => {
  registerModifierDateMiseEnServiceCommand(loadAggregate);
  registerModifierDemandeComplèteRaccordementCommand(loadAggregate);
  registerModifierGestionnaireRéseauProjetCommand(loadAggregate);
  registerModifierPropositionTechniqueEtFinancièreCommand(loadAggregate);
  registerModifierRéférenceDossierRaccordementCommand(loadAggregate);
  registerTransmettreDateMiseEnServiceCommand(loadAggregate);
  registerTransmettreDemandeComplèteRaccordementCommand(loadAggregate);
  registerTransmettrePropositionTechniqueEtFinancièreCommand(loadAggregate);
  registerAttribuerGestionnaireCommand(loadAggregate);
  registerSupprimerDossierDuRaccordementCommand(loadAggregate);
  registerSupprimerRaccordementCommand(loadAggregate);

  registerModifierDateMiseEnServiceUseCase();
  registerModifierDemandeComplèteRaccordementUseCase();
  registerModifierGestionnaireRéseauRaccordementUseCase();
  registerModifierPropositiontechniqueEtFinancièreUseCase();
  registerModifierRéférenceDossierRaccordementUseCase();
  registerTransmettreDateMiseEnServiceUseCase();
  registerTransmettreDemandeComplèteRaccordementUseCase();
  registerTransmettrePropositionTechniqueEtFinancièreUseCase();
  registerAttribuerGestionnaireRéseauUseCase();
  registerSupprimerDossierDuRaccordementUseCase();
};
