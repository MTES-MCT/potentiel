import { GetProjetAggregateRoot } from '../../index.js';

import {
  ListerHistoriqueRaccordementProjetDependencies,
  registerListerHistoriqueRaccordementProjetQuery,
} from './listerHistorique/listerHistoriqueRaccordementProjet.query.js';
import {
  ConsulterDossierRaccordementDependencies,
  registerConsulterDossierRaccordementQuery,
} from './consulter/consulterDossierRaccordement.query.js';
import {
  ConsulterGestionnaireRéseauRaccordementDependencies,
  registerConsulterGestionnaireRéseauRaccordementQuery,
} from './consulter/consulterGestionnaireRéseauRaccordement.query.js';
import {
  ConsulterNombreDeRaccordementDependencies,
  registerConsulterNombreDeRaccordementQuery,
} from './consulter/consulterNombreRaccordement.js';
import {
  ConsulterRaccordementDependencies,
  registerConsulterRaccordementQuery,
} from './consulter/consulterRaccordement.query.js';
import {
  ListerDossierRaccordementQueryDependencies,
  registerListerDossierRaccordementQuery,
} from './lister/listerDossierRaccordement.query.js';
import { registerListerDossierRaccordementEnAttenteMiseEnServiceQuery } from './lister/listerDossierRaccordementEnAttenteMiseEnService.query.js';
import { registerListerDossierRaccordementManquantsQuery } from './lister/listerDossierRaccordementManquants.query.js';
import {
  RechercherDossierRaccordementDependencies,
  registerRechercherDossierRaccordementQuery,
} from './rechercher/rechercherDossierRaccordement.query.js';
import { registerAttribuerGestionnaireCommand } from './attribuer/attribuerGestionnaireRéseau.command.js';
import { registerModifierDemandeComplèteRaccordementCommand } from './modifier/demandeComplète/modifierDemandeComplèteRaccordement.command.js';
import { registerModifierDemandeComplèteRaccordementUseCase } from './modifier/demandeComplète/modifierDemandeComplèteRaccordement.usecase.js';
import { registerModifierGestionnaireRéseauProjetCommand } from './modifier/gestionnaireRéseauDuRaccordement/modifierGestionnaireRéseauRaccordement.command.js';
import { registerModifierGestionnaireRéseauRaccordementUseCase } from './modifier/gestionnaireRéseauDuRaccordement/modifierGestionnaireRéseauRaccordement.usecase.js';
import { registerModifierPropositionTechniqueEtFinancièreCommand } from './modifier/propositionTechniqueEtFinancière/modifierPropositionTechniqueEtFinancière.command.js';
import { registerModifierPropositionTechniqueEtFinancièreUseCase } from './modifier/propositionTechniqueEtFinancière/modifierPropositionTechniqueEtFinancière.usecase.js';
import { registerModifierRéférenceDossierRaccordementCommand } from './modifier/référenceDossierRaccordement/modifierRéférenceDossierRaccordement.command.js';
import { registerModifierRéférenceDossierRaccordementUseCase } from './modifier/référenceDossierRaccordement/modifierRéférenceDossierRaccordement.usecase.js';
import { registerSupprimerDateMiseEnServiceCommand } from './supprimer/dateMiseEnService/supprimerDateMiseEnService.command.js';
import { registerSupprimerDateMiseEnServiceUseCase } from './supprimer/dateMiseEnService/supprimerDateMiseEnService.usecase.js';
import { registerSupprimerDossierDuRaccordementCommand } from './supprimer/dossier/supprimerDossierDuRaccordement.command.js';
import { registerSupprimerDossierDuRaccordementUseCase } from './supprimer/dossier/supprimerDossierDuRaccordement.usecase.js';
import { registerSupprimerRaccordementCommand } from './supprimer/raccordement/supprimerRaccordement.command.js';
import { registerTransmettreDateMiseEnServiceCommand } from './transmettre/dateMiseEnService/transmettreDateMiseEnService.command.js';
import { registerTransmettreDateMiseEnServiceUseCase } from './transmettre/dateMiseEnService/transmettreDateMiseEnService.usecase.js';
import { registerTransmettreDemandeComplèteRaccordementCommand } from './transmettre/demandeComplèteDeRaccordement/transmettreDemandeComplèteRaccordement.command.js';
import { registerTransmettreDemandeComplèteRaccordementUseCase } from './transmettre/demandeComplèteDeRaccordement/transmettreDemandeComplèteRaccordement.usecase.js';
import { registerTransmettrePropositionTechniqueEtFinancièreCommand } from './transmettre/propositionTechniqueEtFinancière/transmettrePropositionTechniqueEtFinancière.command.js';
import { registerTransmettrePropositionTechniqueEtFinancièreUseCase } from './transmettre/propositionTechniqueEtFinancière/transmettrePropositionTechniqueEtFinancière.usecase.js';
import { registerModifierDateMiseEnServiceCommand } from './modifier/dateMiseEnService/modifierDateMiseEnService.command.js';
import { registerModifierDateMiseEnServiceUseCase } from './modifier/dateMiseEnService/modifierDateMiseEnService.usecase.js';

export type RaccordementQueryDependencies = ConsulterDossierRaccordementDependencies &
  ConsulterGestionnaireRéseauRaccordementDependencies &
  ConsulterRaccordementDependencies &
  ConsulterNombreDeRaccordementDependencies &
  RechercherDossierRaccordementDependencies &
  ListerDossierRaccordementQueryDependencies &
  ListerHistoriqueRaccordementProjetDependencies;

export type RaccordementCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerRaccordementQueries = (dependencies: RaccordementQueryDependencies) => {
  registerConsulterDossierRaccordementQuery(dependencies);
  registerConsulterGestionnaireRéseauRaccordementQuery(dependencies);
  registerConsulterNombreDeRaccordementQuery(dependencies);
  registerConsulterRaccordementQuery(dependencies);
  registerRechercherDossierRaccordementQuery(dependencies);
  registerListerDossierRaccordementEnAttenteMiseEnServiceQuery(dependencies);
  registerListerDossierRaccordementQuery(dependencies);
  registerListerDossierRaccordementManquantsQuery(dependencies);
  registerListerHistoriqueRaccordementProjetQuery(dependencies);
};

export const registerRaccordementUseCases = ({
  getProjetAggregateRoot,
}: RaccordementCommandDependencies) => {
  registerModifierDemandeComplèteRaccordementCommand(getProjetAggregateRoot);
  registerModifierGestionnaireRéseauProjetCommand(getProjetAggregateRoot);
  registerModifierPropositionTechniqueEtFinancièreCommand(getProjetAggregateRoot);
  registerModifierRéférenceDossierRaccordementCommand(getProjetAggregateRoot);
  registerModifierDateMiseEnServiceCommand(getProjetAggregateRoot);
  registerTransmettreDateMiseEnServiceUseCase();
  registerTransmettreDateMiseEnServiceCommand(getProjetAggregateRoot);
  registerTransmettreDemandeComplèteRaccordementCommand(getProjetAggregateRoot);
  registerSupprimerDateMiseEnServiceCommand(getProjetAggregateRoot);
  registerTransmettrePropositionTechniqueEtFinancièreCommand(getProjetAggregateRoot);
  registerAttribuerGestionnaireCommand(getProjetAggregateRoot);
  registerSupprimerDossierDuRaccordementCommand(getProjetAggregateRoot);
  registerSupprimerRaccordementCommand(getProjetAggregateRoot);

  registerModifierDemandeComplèteRaccordementUseCase();
  registerModifierGestionnaireRéseauRaccordementUseCase();
  registerModifierPropositionTechniqueEtFinancièreUseCase();
  registerModifierRéférenceDossierRaccordementUseCase();
  registerModifierDateMiseEnServiceUseCase();
  registerSupprimerDateMiseEnServiceUseCase();
  registerTransmettreDemandeComplèteRaccordementUseCase();
  registerTransmettrePropositionTechniqueEtFinancièreUseCase();
  registerSupprimerDossierDuRaccordementUseCase();
};
