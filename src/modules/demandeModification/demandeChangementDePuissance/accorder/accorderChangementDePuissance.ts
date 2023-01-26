import { PuissanceVariationWithDecisionJusticeError } from '../../../modificationRequest'
import { Repository, UniqueEntityID } from '@core/domain'
import { errAsync, logger, okAsync, ResultAsync } from '@core/utils'
import { User } from '@entities'
import { FileContents, FileObject, makeAndSaveFile } from '../../../file'

import { Project } from '../../../project/Project'
import {
  AggregateHasBeenUpdatedSinceError,
  InfraNotAvailableError,
  UnauthorizedError,
} from '../../../shared'
import { ModificationRequest } from '../../../ModificationRequest'
import { userIsNot } from '@modules/users'

type Dépendances = {
  modificationRequestRepo: Repository<ModificationRequest>
  projectRepo: Repository<Project>
  fileRepo: Repository<FileObject>
}

type Commande = {
  modificationRequestId: UniqueEntityID
  acceptanceParams: { type: 'puissance'; newPuissance: number; isDecisionJustice?: boolean }
  versionDate: Date
  responseFile?: { contents: FileContents; filename: string }
  utilisateur: User
}

export const makeAccorderChangementDePuissance =
  ({ fileRepo, modificationRequestRepo, projectRepo }: Dépendances) =>
  ({
    modificationRequestId,
    versionDate,
    responseFile,
    utilisateur,
    acceptanceParams,
  }: Commande) => {
    if (userIsNot(['admin', 'dgec-validateur', 'dreal'])(utilisateur)) {
      return errAsync(new UnauthorizedError())
    }

    return modificationRequestRepo
      .load(modificationRequestId)
      .andThen((modificationRequest) => {
        if (
          modificationRequest.lastUpdatedOn &&
          modificationRequest.lastUpdatedOn.getTime() !== versionDate.getTime()
        ) {
          return errAsync(new AggregateHasBeenUpdatedSinceError())
        }

        return okAsync(modificationRequest)
      })
      .map((modificationRequest) => modificationRequest)
      .andThen((modificationRequest) =>
        projectRepo
          .load(modificationRequest.projectId)
          .andThen((project): ResultAsync<Project, PuissanceVariationWithDecisionJusticeError> => {
            const { isDecisionJustice, newPuissance } = acceptanceParams
            const { puissanceInitiale } = project
            const newPuissanceVariationIsForbidden =
              isDecisionJustice && newPuissance / puissanceInitiale > 1.1

            if (newPuissanceVariationIsForbidden) {
              return errAsync(new PuissanceVariationWithDecisionJusticeError())
            }
            return okAsync(project)
          })
          .map((project) => ({ project, modificationRequest }))
      )
      .andThen(({ project, modificationRequest }) => {
        if (!responseFile) return okAsync({ project, modificationRequest, responseFileId: '' })

        return makeAndSaveFile({
          file: {
            designation: 'modification-request-response',
            forProject: modificationRequest.projectId,
            createdBy: new UniqueEntityID(utilisateur.id),
            filename: responseFile.filename,
            contents: responseFile.contents,
          },
          fileRepo,
        })
          .map((responseFileId) => ({ project, modificationRequest, responseFileId }))
          .mapErr((e) => {
            logger.error(e)
            return new InfraNotAvailableError()
          })
      })
      .andThen(({ project, modificationRequest, responseFileId }) => {
        return project
          .updatePuissance(utilisateur, acceptanceParams.newPuissance)
          .map(() => ({ project, modificationRequest, responseFileId }))
      })
      .andThen(({ project, modificationRequest, responseFileId }) => {
        return modificationRequest
          .accept({ acceptedBy: utilisateur, params: acceptanceParams, responseFileId })
          .map(() => ({ project, modificationRequest }))
      })
      .andThen(({ project, modificationRequest }) => {
        return projectRepo.save(project).map(() => modificationRequest)
      })
      .andThen((modificationRequest) => {
        return modificationRequestRepo.save(modificationRequest)
      })
  }
