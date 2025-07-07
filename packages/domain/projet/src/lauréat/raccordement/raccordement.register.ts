import { GetProjetAggregateRoot } from '../..';

import {
  ListerHistoriqueRaccordementProjetDependencies,
  registerListerHistoriqueRaccordementProjetQuery,
} from './listerHistorique/listerHistoriqueRaccordementProjet.query';
import {
  ConsulterDossierRaccordementDependencies,
  registerConsulterDossierRaccordementQuery,
} from './consulter/consulterDossierRaccordement.query';
import {
  ConsulterGestionnaireRéseauRaccordementDependencies,
  registerConsulterGestionnaireRéseauRaccordementQuery,
} from './consulter/consulterGestionnaireRéseauRaccordement.query';
import {
  ConsulterNombreDeRaccordementDependencies,
  registerConsulterNombreDeRaccordementQuery,
} from './consulter/consulterNombreRaccordement';
import {
  ConsulterRaccordementDependencies,
  registerConsulterRaccordementQuery,
} from './consulter/consulterRaccordement.query';
import {
  ListerDossierRaccordementQueryDependencies,
  registerListerDossierRaccordementQuery,
} from './lister/listerDossierRaccordement.query';
import { registerListerDossierRaccordementEnAttenteMiseEnServiceQuery } from './lister/listerDossierRaccordementEnAttenteMiseEnService.query';
import { registerListerDossierRaccordementManquantsQuery } from './lister/listerDossierRaccordementManquants.query';
import {
  ListerRaccordementQueryDependencies,
  registerListerRaccordementQuery,
} from './lister/listerRaccordement.query';
import {
  RechercherDossierRaccordementDependencies,
  registerRechercherDossierRaccordementQuery,
} from './rechercher/rechercherDossierRaccordement.query';
import { registerAttribuerGestionnaireCommand } from './attribuer/attribuerGestionnaireRéseau.command';
import { registerModifierDemandeComplèteRaccordementCommand } from './modifier/demandeComplète/modifierDemandeComplèteRaccordement.command';
import { registerModifierDemandeComplèteRaccordementUseCase } from './modifier/demandeComplète/modifierDemandeComplèteRaccordement.usecase';
import { registerModifierGestionnaireRéseauProjetCommand } from './modifier/gestionnaireRéseauDuRaccordement/modifierGestionnaireRéseauRaccordement.command';
import { registerModifierGestionnaireRéseauRaccordementUseCase } from './modifier/gestionnaireRéseauDuRaccordement/modifierGestionnaireRéseauRaccordement.usecase';
import { registerModifierPropositionTechniqueEtFinancièreCommand } from './modifier/propositionTechniqueEtFinancière/modifierPropositiontechniqueEtFinancière.command';
import { registerModifierPropositiontechniqueEtFinancièreUseCase } from './modifier/propositionTechniqueEtFinancière/modifierPropositiontechniqueEtFinancière.usecase';
import { registerModifierRéférenceDossierRaccordementCommand } from './modifier/référenceDossierRaccordement/modifierRéférenceDossierRaccordement.command';
import { registerModifierRéférenceDossierRaccordementUseCase } from './modifier/référenceDossierRaccordement/modifierRéférenceDossierRaccordement.usecase';
import { registerSupprimerDateMiseEnServiceCommand } from './supprimer/dateMiseEnService/supprimerDateMiseEnService.command';
import { registerSupprimerDateMiseEnServiceUseCase } from './supprimer/dateMiseEnService/supprimerDateMiseEnService.usecase';
import { registerSupprimerDossierDuRaccordementCommand } from './supprimer/dossier/supprimerDossierDuRaccordement.command';
import { registerSupprimerDossierDuRaccordementUseCase } from './supprimer/dossier/supprimerDossierDuRaccordement.usecase';
import { registerSupprimerRaccordementCommand } from './supprimer/raccordement/supprimerRaccordement.command';
import { registerTransmettreDateMiseEnServiceCommand } from './transmettre/dateMiseEnService/transmettreDateMiseEnService.command';
import { registerTransmettreDateMiseEnServiceUseCase } from './transmettre/dateMiseEnService/transmettreDateMiseEnService.usecase';
import { registerTransmettreDemandeComplèteRaccordementCommand } from './transmettre/demandeComplèteDeRaccordement/transmettreDemandeComplèteRaccordement.command';
import { registerTransmettreDemandeComplèteRaccordementUseCase } from './transmettre/demandeComplèteDeRaccordement/transmettreDemandeComplèteRaccordement.usecase';
import { registerTransmettrePropositionTechniqueEtFinancièreCommand } from './transmettre/propositionTechniqueEtFinancière/transmettrePropositionTechniqueEtFinancière.command';
import { registerTransmettrePropositionTechniqueEtFinancièreUseCase } from './transmettre/propositionTechniqueEtFinancière/transmettrePropositionTechniqueEtFinancière.usecase';

export type RaccordementQueryDependencies = ConsulterDossierRaccordementDependencies &
  ConsulterGestionnaireRéseauRaccordementDependencies &
  ConsulterRaccordementDependencies &
  ConsulterNombreDeRaccordementDependencies &
  RechercherDossierRaccordementDependencies &
  ListerDossierRaccordementQueryDependencies &
  ListerRaccordementQueryDependencies &
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
  registerListerRaccordementQuery(dependencies);
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
  registerTransmettreDateMiseEnServiceCommand(getProjetAggregateRoot);
  registerTransmettreDemandeComplèteRaccordementCommand(getProjetAggregateRoot);
  registerSupprimerDateMiseEnServiceCommand(getProjetAggregateRoot);
  registerTransmettrePropositionTechniqueEtFinancièreCommand(getProjetAggregateRoot);
  registerAttribuerGestionnaireCommand(getProjetAggregateRoot);
  registerSupprimerDossierDuRaccordementCommand(getProjetAggregateRoot);
  registerSupprimerRaccordementCommand(getProjetAggregateRoot);

  registerModifierDemandeComplèteRaccordementUseCase();
  registerModifierGestionnaireRéseauRaccordementUseCase();
  registerModifierPropositiontechniqueEtFinancièreUseCase();
  registerModifierRéférenceDossierRaccordementUseCase();
  registerTransmettreDateMiseEnServiceUseCase();
  registerSupprimerDateMiseEnServiceUseCase();
  registerTransmettreDemandeComplèteRaccordementUseCase();
  registerTransmettrePropositionTechniqueEtFinancièreUseCase();
  registerSupprimerDossierDuRaccordementUseCase();
};
