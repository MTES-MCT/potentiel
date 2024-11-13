import { UtilisateurReadModel } from '../modules/utilisateur/récupérer/UtilisateurReadModel';
import { JWT } from 'next-auth/jwt';
declare module 'express-serve-static-core' {
  // eslint-disable-next-line
  interface Request {
    user: UtilisateurReadModel;
    token: JWT;
  }
}
