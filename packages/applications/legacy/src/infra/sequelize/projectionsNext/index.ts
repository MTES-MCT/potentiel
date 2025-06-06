// /!\ MERCI DE NE PAS UTILISER L'EXTENSION BARREL DANS CETTE PARTIE DU PROJET !!!
// TODO: executions des initializers. Malheureusement on est encore obligé de faire cela dans l'index du module, car l'init de l'app se fait avec des sides effetcs...
// Il faudrait faire ça au bootstrap de l'app (ou des tests), ne pas importer la config Sequelize et appeler les fonctions d'initialize dans ce fichier.
// On fera ce refacto plus tard quand on sortira la partie projection et la partie model de la DB dans des packages.
import { sequelizeInstance } from '../../../sequelize.config';
import { initializeModels } from './models.initializer';

initializeModels(sequelizeInstance);

// Export module types
export * from './eventHandler';
export * from './projector';
export * from './subscribe';

// Export initializer de projections et projectors (pour configurer le module depuis l'extérieur, pas encore utiliser à cause des imports side effects)
export * from './projectors.initializer';
export * from './models.initializer';

// Export des models pour utilisation dans les queries
export * from './file/file.model';
export * from './modificationRequest/modificationRequest.model';
export * from './notification/notification.model';
export * from './project/project.model';
export * from './tâches/tâches.model';
export * from './userDreal/userDreal.model';
export * from './userProjects/userProjects.model';
export * from './users/users.model';

// Export des projectors pour rebuild dans les migrations si besoin
export * from './modificationRequest/modificationRequest.projector';
export * from './project/project.projector';
export * from './tâches/tâches.projector';
export * from './userDreal/userDreal.projector';
export * from './userProjects/userProjects.projector';
export * from './users/user.projector';

// Export des updates (side effects à l'intérieur..., à faire après l'init des models)
// TODO: la liste des exports qui suit doit à terme être supprimé.
export * from './modificationRequest/updates';
export * from './project/updates';
export * from './userDreal/updates';
export * from './userProjects/updates';
export * from './users/updates';
