import { logger } from '@core/utils'
import { CreateUserCredentials } from '@modules/authN/queries'
import { ProfilUtilisateurCréé } from '@modules/utilisateur'
import { UserRole } from '../../users'

type OnProfilUtilisateurCréé = (évènement: ProfilUtilisateurCréé) => Promise<void>

type MakeOnProfilUtilisateurCréé = (
  createUserCredentials: CreateUserCredentials
) => OnProfilUtilisateurCréé

export const makeOnProfilUtilisateurCréé: MakeOnProfilUtilisateurCréé =
  (createUserCredentials) => async (évènement) => {
    const { email, role, nom, prénom } = évènement.payload
    try {
      const res = await createUserCredentials({
        email,
        role: role as UserRole,
        fullName: `${prénom} ${nom}`,
      })
      if (res.isErr()) {
        throw res.error
      }
    } catch (error) {
      logger.error(error)
    }
  }
