import { EventBus, Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, okAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { FileContents, FileObject, makeFileObject } from '../../file'
import { Project } from '../../project/Project'
import { UnauthorizedError } from '../../shared'
import { ModificationReceived } from '../events'
import { AppelOffreRepo } from '@dataAccess'
import { NouveauCahierDesChargesNonChoisiError } from '@modules/demandeModification'
import { GetUserByEmail } from '@modules/users/queries'
import { UserInvitedToProject } from '@modules/authZ'

type ChangerProducteurDeps = {
  eventBus: EventBus
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  projectRepo: TransactionalRepository<Project>
  fileRepo: Repository<FileObject>
  findAppelOffreById: AppelOffreRepo['findById']
  getUserByEmail: GetUserByEmail
}

type ChangerProducteurArgs = {
  projetId: string
  porteur: User
  nouveauProducteur: string
  justification?: string
  fichier?: { contents: FileContents; filename: string }
  email?: string
}

export const makeChangerProducteur =
  ({
    eventBus,
    shouldUserAccessProject,
    projectRepo,
    fileRepo,
    findAppelOffreById,
    getUserByEmail,
  }: ChangerProducteurDeps) =>
  ({
    projetId,
    porteur,
    nouveauProducteur,
    justification,
    fichier,
    email,
  }: ChangerProducteurArgs) => {
    return wrapInfra(shouldUserAccessProject({ projectId: projetId, user: porteur })).andThen(
      (utilisateurALesDroits) => {
        if (!utilisateurALesDroits) return errAsync(new UnauthorizedError())
        return projectRepo.transaction(new UniqueEntityID(projetId), (projet) => {
          return wrapInfra(findAppelOffreById(projet.appelOffreId))
            .andThen((appelOffre) => {
              if (!projet.newRulesOptIn && appelOffre?.choisirNouveauCahierDesCharges) {
                return errAsync(new NouveauCahierDesChargesNonChoisiError())
              }

              if (fichier) {
                return makeFileObject({
                  designation: 'modification-request',
                  forProject: new UniqueEntityID(projetId),
                  createdBy: new UniqueEntityID(porteur.id),
                  filename: fichier.filename,
                  contents: fichier.contents,
                }).asyncAndThen((file) => fileRepo.save(file).map(() => file.id.toString()))
              }

              return okAsync(null)
            })
            .andThen((fileId) => {
              return projet
                .updateProducteur(porteur, nouveauProducteur)
                .asyncMap(async () => fileId)
            })
            .andThen((fileId) => {
              return eventBus.publish(
                new ModificationReceived({
                  payload: {
                    modificationRequestId: new UniqueEntityID().toString(),
                    projectId: projetId,
                    requestedBy: porteur.id,
                    type: 'producteur',
                    producteur: nouveauProducteur,
                    justification,
                    ...(fileId && { fileId }),
                    authority: 'dreal',
                  },
                })
              )
            })
            .andThen(() => {
              if (email) {
                return getUserByEmail(email).andThen((nouveauPorteurOuNull) => {
                  if (nouveauPorteurOuNull) {
                    return eventBus.publish(
                      new UserInvitedToProject({
                        payload: {
                          userId: nouveauPorteurOuNull.id,
                          projectIds: [projetId],
                          invitedBy: porteur.id,
                        },
                      })
                    )
                  }
                  return okAsync(null)
                })
              }
              return okAsync(null)
            })
        })
      }
    )
  }
