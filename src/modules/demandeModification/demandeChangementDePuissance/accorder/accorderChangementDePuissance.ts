import { PuissanceVariationWithDecisionJusticeError } from '../../../modificationRequest'
import { Repository, UniqueEntityID } from '@core/domain'
import { errAsync, logger, okAsync } from '@core/utils'
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
  demandeId: UniqueEntityID
  paramètres: { type: 'puissance'; newPuissance: number; isDecisionJustice?: boolean }
  versionDate: Date
  responseFile?: { contents: FileContents; filename: string }
  utilisateur: User
}

export const makeAccorderChangementDePuissance =
  ({ fileRepo, modificationRequestRepo, projectRepo }: Dépendances) =>
  ({ demandeId, versionDate, responseFile, utilisateur, paramètres }: Commande) => {
    if (userIsNot(['admin', 'dgec-validateur', 'dreal'])(utilisateur)) {
      return errAsync(new UnauthorizedError())
    }

    return modificationRequestRepo
      .load(demandeId)
      .andThen((demande) => {
        if (demande.lastUpdatedOn && demande.lastUpdatedOn.getTime() !== versionDate.getTime()) {
          return errAsync(new AggregateHasBeenUpdatedSinceError())
        }

        return okAsync(demande)
      })
      .map((demande) => demande)
      .andThen((demande) =>
        projectRepo
          .load(demande.projectId)
          .andThen((projet) => {
            const { isDecisionJustice, newPuissance } = paramètres
            const { puissanceInitiale } = projet
            const newPuissanceVariationIsForbidden =
              isDecisionJustice && newPuissance / puissanceInitiale > 1.1

            if (newPuissanceVariationIsForbidden) {
              return errAsync(new PuissanceVariationWithDecisionJusticeError())
            }
            return okAsync(projet)
          })
          .map((projet) => ({ projet, demande }))
      )
      .andThen(({ projet, demande }) => {
        if (!responseFile) return okAsync({ projet, demande, responseFileId: '' })

        return makeAndSaveFile({
          file: {
            designation: 'modification-request-response',
            forProject: demande.projectId,
            createdBy: new UniqueEntityID(utilisateur.id),
            filename: responseFile.filename,
            contents: responseFile.contents,
          },
          fileRepo,
        })
          .map((responseFileId) => ({ projet, demande, responseFileId }))
          .mapErr((e) => {
            logger.error(e)
            return new InfraNotAvailableError()
          })
      })
      .andThen(({ projet, demande, responseFileId }) => {
        return projet
          .updatePuissance(utilisateur, paramètres.newPuissance)
          .map(() => ({ projet, demande, responseFileId }))
      })
      .andThen(({ projet, demande, responseFileId }) => {
        return demande
          .accept({ acceptedBy: utilisateur, params: paramètres, responseFileId })
          .map(() => ({ projet, demande }))
      })
      .andThen(({ projet, demande }) => {
        return projectRepo.save(projet).map(() => demande)
      })
      .andThen((demande) => {
        return modificationRequestRepo.save(demande)
      })
  }
