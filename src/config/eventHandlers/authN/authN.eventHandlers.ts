import { authNEventSubscriber } from './authNEventSubscriber';
import { handleUserCreated, makeOnProfilUtilisateurCréé } from '../../../modules/authN';
import { UserCreated } from '../../../modules/users';
import { createUserCredentials } from '../../credentials.config';
import { ProfilUtilisateurCréé } from '../../../modules/utilisateur';
import { eventStore } from '../../eventStore.config';

// Ne pas subscribe sur redis sinon tous les utilisateur déjà créé (message dans redis) vont être rejoué et vont générer des erreurs
// De plus cet évènement devrait être à terme migré vers ProfilUtilisateurCréé
eventStore.subscribe(
  UserCreated.type,
  handleUserCreated({
    createUserCredentials,
  }),
);

authNEventSubscriber(ProfilUtilisateurCréé, makeOnProfilUtilisateurCréé(createUserCredentials));

console.log('AuthN Event Handlers Initialized');
