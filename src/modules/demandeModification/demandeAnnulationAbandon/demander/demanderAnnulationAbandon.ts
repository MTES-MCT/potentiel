import { EventStore, Repository } from '@core/domain'
import { User } from '@entities'
import { AppelOffreRepo } from '@dataAccess'
import { GetProjectAppelOffreId } from '../../../modificationRequest'
import { Project } from '@modules/project'
import { wrapInfra, errAsync, okAsync } from '@core/utils'
import { UnauthorizedError } from '@modules/shared'

type Commande = {
  user: User
  projetId: string
}

type Dépendances = {
  publishToEventStore: EventStore['publish']
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  findAppelOffreById: AppelOffreRepo['findById']
  getProjectAppelOffreId: GetProjectAppelOffreId
  projectRepo: Repository<Project>
}

export const makeDemanderAnnulationAbandon =
  ({
    publishToEventStore,
    shouldUserAccessProject,
    findAppelOffreById,
    getProjectAppelOffreId,
    projectRepo,
  }: Dépendances) =>
  ({ user, projetId }: Commande) => {
    return wrapInfra(shouldUserAccessProject({ user, projectId: projetId })).andThen(
      (utilisateurALesDroits) => {
        if (!utilisateurALesDroits) {
          return errAsync(new UnauthorizedError())
        }
        return okAsync(null)
      }
    )
    //   .andThen(() => {
    //     return projectRepo.load(new UniqueEntityID(projectId))
    //   })
    //   .andThen((project) => {
    //     if (!project.isClasse) {
    //       return errAsync(new DemanderAnnulationAbandonError(`Un projet éliminé ne peut pas être abandonné.`))
    //     }
    //     if (project.abandonedOn > 0) {
    //       return errAsync(new DemanderAnnulationAbandonError(`Le projet est déjà abandonné.`))
    //     }
    //     return okAsync(project)
    //   })
    //   .andThen((project) => {
    //     return getProjectAppelOffreId(projectId).andThen((appelOffreId) => {
    //       return wrapInfra(findAppelOffreById(appelOffreId)).map((appelOffre) => ({
    //         appelOffre,
    //         project,
    //       }))
    //     })
    //   })
    //   .andThen(({ appelOffre, project }) => {
    //     if (
    //       project.cahierDesCharges.type === 'initial' &&
    //       appelOffre?.choisirNouveauCahierDesCharges
    //     ) {
    //       return errAsync(new NouveauCahierDesChargesNonChoisiError())
    //     }
    //     if (file) {
    //       return makeFileObject({
    //         designation: 'modification-request',
    //         forProject: new UniqueEntityID(projectId),
    //         createdBy: new UniqueEntityID(user.id),
    //         filename: file.filename,
    //         contents: file.contents,
    //       }).asyncAndThen((file) =>
    //         fileRepo.save(file).map(() => ({
    //           fileId: file.id.toString(),
    //           project,
    //         }))
    //       )
    //     }
    //     return okAsync({
    //       fileId: undefined,
    //       project,
    //     })
    //   })
    //   .andThen(({ fileId, project }) => {
    //     return publishToEventStore(
    //       new AbandonDemandé({
    //         payload: {
    //           demandeAbandonId: new UniqueEntityID().toString(),
    //           projetId: projectId,
    //           ...(fileId && { fichierId: fileId }),
    //           justification,
    //           autorité: 'dgec',
    //           porteurId: user.id,
    //           cahierDesCharges: formatCahierDesChargesRéférence(project.cahierDesCharges),
    //         },
    //       })
    //     )
    //   })
  }
