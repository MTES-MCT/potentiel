import type { GetProjetAggregateRoot } from '../../index.js';
import { registerAttribuerGestionnaireCommand } from './attribuer/attribuerGestionnaireRéseau.command.js';
import {
  type ConsulterDossierRaccordementDependencies,
  registerConsulterDossierRaccordementQuery,
} from './consulter/consulterDossierRaccordement.query.js';
import {
  type ConsulterGestionnaireRéseauRaccordementDependencies,
  registerConsulterGestionnaireRéseauRaccordementQuery,
} from './consulter/consulterGestionnaireRéseauRaccordement.query.js';
import {
  type ConsulterNombreDeRaccordementDependencies,
  registerConsulterNombreDeRaccordementQuery,
} from './consulter/consulterNombreRaccordement.js';
import {
  type ConsulterRaccordementDependencies,
  registerConsulterRaccordementQuery,
} from './consulter/consulterRaccordement.query.js';
import {
  type ConsulterDocumentDependencies,
  registerConsulterDocumentQuery,
} from './document/consulter/consulterDocument.query.js';
import { registerModifierDocumentCommand } from './document/modifier/modifierDocumentRaccordement.command.js';
import { registerModifierDocumentUseCase } from './document/modifier/modifierDocumentRaccordement.usecase.js';
import { registerSupprimerDocumentCommand } from './document/supprimer/supprimerDocumentRaccordement.command.js';
import { registerSupprimerDocumentUseCase } from './document/supprimer/supprimerDocumentRaccordement.usecase.js';
import { registerTransmettreDocumentCommand } from './document/transmettre/transmettreDocumentRaccordement.command.js';
import { registerTransmettreDocumentUseCase } from './document/transmettre/transmettreDocumentRaccordement.usecase.js';
import {
  type ListerDossierRaccordementQueryDependencies,
  registerListerDossierRaccordementQuery,
} from './lister/listerDossierRaccordement.query.js';
import { registerListerDossierRaccordementEnAttenteMiseEnServiceQuery } from './lister/listerDossierRaccordementEnAttenteMiseEnService.query.js';
import { registerListerDossierRaccordementManquantsQuery } from './lister/listerDossierRaccordementManquants.query.js';
import {
  type ListerHistoriqueRaccordementProjetDependencies,
  registerListerHistoriqueRaccordementProjetQuery,
} from './listerHistorique/listerHistoriqueRaccordementProjet.query.js';
import { registerModifierDateMiseEnServiceCommand } from './modifier/dateMiseEnService/modifierDateMiseEnService.command.js';
import { registerModifierDateMiseEnServiceUseCase } from './modifier/dateMiseEnService/modifierDateMiseEnService.usecase.js';
import { registerModifierDemandeComplèteRaccordementCommand } from './modifier/demandeComplète/modifierDemandeComplèteRaccordement.command.js';
import { registerModifierDemandeComplèteRaccordementUseCase } from './modifier/demandeComplète/modifierDemandeComplèteRaccordement.usecase.js';
import { registerModifierGestionnaireRéseauProjetCommand } from './modifier/gestionnaireRéseauDuRaccordement/modifierGestionnaireRéseauRaccordement.command.js';
import { registerModifierGestionnaireRéseauRaccordementUseCase } from './modifier/gestionnaireRéseauDuRaccordement/modifierGestionnaireRéseauRaccordement.usecase.js';
import { registerModifierPropositionTechniqueEtFinancièreCommand } from './modifier/propositionTechniqueEtFinancière/modifierPropositionTechniqueEtFinancière.command.js';
import { registerModifierPropositionTechniqueEtFinancièreUseCase } from './modifier/propositionTechniqueEtFinancière/modifierPropositionTechniqueEtFinancière.usecase.js';
import { registerModifierRéférenceDossierRaccordementCommand } from './modifier/référenceDossierRaccordement/modifierRéférenceDossierRaccordement.command.js';
import { registerModifierRéférenceDossierRaccordementUseCase } from './modifier/référenceDossierRaccordement/modifierRéférenceDossierRaccordement.usecase.js';
import {
  type RechercherDossierRaccordementDependencies,
  registerRechercherDossierRaccordementQuery,
} from './rechercher/rechercherDossierRaccordement.query.js';
import { registerSupprimerDateMiseEnServiceCommand } from './supprimer/dateMiseEnService/supprimerDateMiseEnService.command.js';
import { registerSupprimerDateMiseEnServiceUseCase } from './supprimer/dateMiseEnService/supprimerDateMiseEnService.usecase.js';
import { registerSupprimerDossierDuRaccordementCommand } from './supprimer/dossier/supprimerDossierDuRaccordement.command.js';
import { registerSupprimerDossierDuRaccordementUseCase } from './supprimer/dossier/supprimerDossierDuRaccordement.usecase.js';
import { registerTransmettreDateMiseEnServiceCommand } from './transmettre/dateMiseEnService/transmettreDateMiseEnService.command.js';
import { registerTransmettreDateMiseEnServiceUseCase } from './transmettre/dateMiseEnService/transmettreDateMiseEnService.usecase.js';
import { registerTransmettreDemandeComplèteRaccordementCommand } from './transmettre/demandeComplèteDeRaccordement/transmettreDemandeComplèteRaccordement.command.js';
import { registerTransmettreDemandeComplèteRaccordementUseCase } from './transmettre/demandeComplèteDeRaccordement/transmettreDemandeComplèteRaccordement.usecase.js';
import { registerTransmettrePropositionTechniqueEtFinancièreCommand } from './transmettre/propositionTechniqueEtFinancière/transmettrePropositionTechniqueEtFinancière.command.js';
import { registerTransmettrePropositionTechniqueEtFinancièreUseCase } from './transmettre/propositionTechniqueEtFinancière/transmettrePropositionTechniqueEtFinancière.usecase.js';

export type RaccordementQueryDependencies = ConsulterDossierRaccordementDependencies &
  ConsulterGestionnaireRéseauRaccordementDependencies &
  ConsulterRaccordementDependencies &
  ConsulterNombreDeRaccordementDependencies &
  RechercherDossierRaccordementDependencies &
  ListerDossierRaccordementQueryDependencies &
  ListerHistoriqueRaccordementProjetDependencies &
  ConsulterDocumentDependencies;

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
  registerConsulterDocumentQuery(dependencies);
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
  registerTransmettreDocumentCommand(getProjetAggregateRoot);
  registerModifierDocumentCommand(getProjetAggregateRoot);
  registerSupprimerDocumentCommand(getProjetAggregateRoot);

  registerModifierDemandeComplèteRaccordementUseCase();
  registerModifierGestionnaireRéseauRaccordementUseCase();
  registerModifierPropositionTechniqueEtFinancièreUseCase();
  registerModifierRéférenceDossierRaccordementUseCase();
  registerModifierDateMiseEnServiceUseCase();
  registerSupprimerDateMiseEnServiceUseCase();
  registerTransmettreDemandeComplèteRaccordementUseCase();
  registerTransmettrePropositionTechniqueEtFinancièreUseCase();
  registerSupprimerDossierDuRaccordementUseCase();
  registerTransmettreDocumentUseCase();
  registerModifierDocumentUseCase();
  registerSupprimerDocumentUseCase();
};
