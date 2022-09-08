import { logger } from '@core/utils'
import { ProjectRepo, UserRepo } from '@dataAccess'
import { UserRightsToProjectRevoked } from '@modules/authZ'
import { NotifierPorteurRévocationAccèsProjet } from '@modules/notification/useCases'

type OnUserRightsToProjectRevoked = (événement: UserRightsToProjectRevoked) => Promise<void>

type MakeOnUserRightsToProjectRevoked = (dépendances: {
  notifierPorteurRévocationAccèsProjet: NotifierPorteurRévocationAccèsProjet
  getProject: ProjectRepo['findById']
  getUser: UserRepo['findById']
}) => OnUserRightsToProjectRevoked

export const makeOnUserRightsToProjectRevoked: MakeOnUserRightsToProjectRevoked =
  ({ notifierPorteurRévocationAccèsProjet, getProject, getUser }) =>
  async ({ payload: { projectId: projetId, userId: porteurId } }) => {
    const projet = await getProject(projetId)

    if (!projet) {
      logger.error(new Error(`Erreur : onToutAccèsAuProjetRévoqué, projet ${projetId} non trouvé.`))
      return
    }

    ;(await getUser(porteurId)).match({
      some: async ({ email, fullName }) => {
        await notifierPorteurRévocationAccèsProjet({
          email,
          nomPorteur: fullName,
          nomProjet: projet.nomProjet,
          porteurId,
          projetId,
        })
      },
      none: () => {},
    })
  }
