import { logger } from '../../../core/utils';
import { ProfilUtilisateurCréé } from '../../utilisateur';
import { CreateUserCredentials } from '../queries';

type OnProfilUtilisateurCréé = (évènement: ProfilUtilisateurCréé) => Promise<void>;

type MakeOnProfilUtilisateurCréé = (
  createUserCredentials: CreateUserCredentials,
) => OnProfilUtilisateurCréé;

export const makeOnProfilUtilisateurCréé: MakeOnProfilUtilisateurCréé =
  (createUserCredentials) => async (évènement) => {
    const { email, role, nom, prénom } = évènement.payload;
    try {
      const res = await createUserCredentials({
        email,
        role,
        fullName: `${prénom} ${nom}`,
      });
      if (res.isErr()) {
        throw res.error;
      }
    } catch (error) {
      logger.error(error);
    }
  };
