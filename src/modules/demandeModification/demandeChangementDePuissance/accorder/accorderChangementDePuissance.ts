import { Repository, UniqueEntityID } from '@core/domain'
import { errAsync, logger, okAsync } from '@core/utils'
import { User } from '@entities'
import { FileContents, FileObject, makeAndSaveFile } from '@modules/file'

import { Project } from '@modules/project/Project'
import {
  AggregateHasBeenUpdatedSinceError,
  FichierDeRéponseObligatoireError,
  InfraNotAvailableError,
  UnauthorizedError,
} from '@modules/shared'
import {
  ModificationRequest,
  PuissanceVariationWithDecisionJusticeError,
} from '@modules/modificationRequest'
import { userIsNot } from '@modules/users'

type Dépendances = {
  modificationRequestRepo: Repository<ModificationRequest>
  projectRepo: Repository<Project>
  fileRepo: Repository<FileObject>
}

type Commande = {
  demandeId: UniqueEntityID
  paramètres: { newPuissance: number; isDecisionJustice?: boolean }
  versionDate: Date
  fichierRéponse?: { contents: FileContents; filename: string }
  utilisateur: User
}

export const makeAccorderChangementDePuissance =
  ({ fileRepo, modificationRequestRepo, projectRepo }: Dépendances) =>
  ({ demandeId, versionDate, fichierRéponse, utilisateur, paramètres }: Commande) => {
    if (userIsNot(['admin', 'dgec-validateur', 'dreal'])(utilisateur)) {
      return errAsync(new UnauthorizedError())
    }

    if (!fichierRéponse) {
      return errAsync(new FichierDeRéponseObligatoireError())
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
        return makeAndSaveFile({
          file: {
            designation: 'modification-request-response',
            forProject: demande.projectId,
            createdBy: new UniqueEntityID(utilisateur.id),
            filename: fichierRéponse.filename,
            contents: fichierRéponse.contents,
          },
          fileRepo,
        })
          .map((fichierRéponseId) => ({ projet, demande, fichierRéponseId }))
          .mapErr((e) => {
            logger.error(e)
            return new InfraNotAvailableError()
          })
      })
      .andThen(({ projet, demande, fichierRéponseId }) => {
        return projet
          .updatePuissance(utilisateur, paramètres.newPuissance)
          .map(() => ({ projet, demande, fichierRéponseId }))
      })
      .andThen(({ projet, demande, fichierRéponseId }) => {
        return demande
          .accept({
            acceptedBy: utilisateur,
            params: { ...paramètres, type: 'puissance' },
            responseFileId: fichierRéponseId,
          })
          .map(() => ({ projet, demande }))
      })
      .andThen(({ projet, demande }) => {
        return projectRepo.save(projet).map(() => demande)
      })
      .andThen((demande) => {
        return modificationRequestRepo.save(demande)
      })
  }
