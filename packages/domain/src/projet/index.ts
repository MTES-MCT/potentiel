// ReadModel
export { ProjetReadModel, RésuméProjetReadModel } from './query/consulter/projet.readModel';

// Usecases
export { buildConsulterProjetUseCase } from './usecase/consulterProjet.usecase';
export { buildModifierGestionnaireRéseauProjetUseCase } from './usecase/modifierGestionnaireRéseauProjet.usecase';

// EventHandlers (TODO: sera supprimé lorsque le mediateur pourra publish des messages)
export { gestionnaireRéseauProjetModifiéHandlerFactory } from './command/modifierGestionnaireRéseau/handlers/gestionnaireRéseauProjetModifié.handler';
