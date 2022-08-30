import { errAsync, okAsync } from 'neverthrow'
import { EventStore, Repository, UniqueEntityID } from '@core/domain'
import { wrapInfra, ResultAsync } from '@core/utils'
import { User } from '@entities'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { AbandonDemandé } from '../events'
import { FileContents, FileObject, makeFileObject } from '../../../file'
import { AppelOffreRepo } from '@dataAccess'
import { GetProjectAppelOffreId } from '../../../modificationRequest'
import { Project, ProjectNewRulesOptedIn } from '@modules/project'
import { DemanderAbandonError } from './DemanderAbandonError'
import { NouveauCahierDesChargesNonChoisiError } from '@modules/demandeModification/demandeDélai/demander'

type DemanderAbandon = (commande: {
  user: User
  projectId: string
  justification?: string
  newRulesOptIn?: true
  file?: {
    contents: FileContents
    filename: string
  }
}) => ResultAsync<null, InfraNotAvailableError | UnauthorizedError>

type MakeDemanderAbandon = (dépendances: {
  publishToEventStore: EventStore['publish']
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  fileRepo: Repository<FileObject>
  findAppelOffreById: AppelOffreRepo['findById']
  getProjectAppelOffreId: GetProjectAppelOffreId
  projectRepo: Repository<Project>
}) => DemanderAbandon

export const makeDemanderAbandon: MakeDemanderAbandon =
  ({
    publishToEventStore,
    shouldUserAccessProject,
    fileRepo,
    findAppelOffreById,
    getProjectAppelOffreId,
    projectRepo,
  }) =>
  ({ user, projectId, justification, file, newRulesOptIn }) => {
    return wrapInfra(shouldUserAccessProject({ user, projectId }))
      .andThen((utilisateurALesDroits) => {
        if (!utilisateurALesDroits) {
          return errAsync(new UnauthorizedError())
        }
        return okAsync(null)
      })
      .andThen(() => {
        return projectRepo.load(new UniqueEntityID(projectId))
      })
      .andThen((project) => {
        if (!project.isClasse) {
          return errAsync(new DemanderAbandonError(`Un projet éliminé ne peut pas être abandonné.`))
        }
        if (project.abandonedOn > 0) {
          return errAsync(new DemanderAbandonError(`Le projet est déjà abandonné.`))
        }
        return okAsync(project)
      })
      .andThen((project) => {
        return getProjectAppelOffreId(projectId).andThen((appelOffreId) => {
          return wrapInfra(findAppelOffreById(appelOffreId)).map((appelOffre) => ({
            appelOffre,
            project,
          }))
        })
      })
      .andThen(({ appelOffre, project }) => {
        const doitSouscrireAuNouveauCDC =
          !project.newRulesOptIn && appelOffre?.choisirNouveauCahierDesCharges

        if (doitSouscrireAuNouveauCDC) {
          if (!newRulesOptIn) {
            return errAsync(new NouveauCahierDesChargesNonChoisiError())
          }

          return publishToEventStore(
            new ProjectNewRulesOptedIn({ payload: { projectId, optedInBy: user.id } })
          )
        }

        if (file) {
          return makeFileObject({
            designation: 'modification-request',
            forProject: new UniqueEntityID(projectId),
            createdBy: new UniqueEntityID(user.id),
            filename: file.filename,
            contents: file.contents,
          }).asyncAndThen((file) => fileRepo.save(file).map(() => file.id.toString()))
        }

        return okAsync(null)
      })
      .andThen((fileId) => {
        return publishToEventStore(
          new AbandonDemandé({
            payload: {
              demandeAbandonId: new UniqueEntityID().toString(),
              projetId: projectId,
              ...(fileId && { fichierId: fileId }),
              justification,
              autorité: 'dgec',
              porteurId: user.id,
            },
          })
        )
      })
  }
