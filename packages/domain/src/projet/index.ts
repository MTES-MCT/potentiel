// ReadModel
export { ProjetReadModel, RésuméProjetReadModel } from './projet.readModel';

// Usecases
export { buildConsulterProjetUseCase } from './consulterProjet.usecase';
export { buildModifierGestionnaireRéseauProjetUseCase } from './modifierGestionnaireRéseauProjet.usecase';

// EventHandlers (TODO: sera supprimé lorsque le mediateur pourra publish des messages)
export { gestionnaireRéseauProjetModifiéHandlerFactory } from './modifierGestionnaireRéseau/handlers/gestionnaireRéseauProjetModifié.handler';

// helpers
export { formatIdentifiantProjet } from './identifiantProjet';
