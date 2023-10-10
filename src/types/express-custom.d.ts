import { Utilisateur } from '@potentiel/domain';
import { UtilisateurReadModel } from '../modules/utilisateur/récupérer/UtilisateurReadModel';

declare module 'express-serve-static-core' {
  // eslint-disable-next-line
  interface Request {
    user: UtilisateurReadModel & Utilisateur;
    kauth: any;
  }
}

declare module 'express-session' {
  interface SessionData {
    apiResults?: Record<string, unknown>;
  }
}
