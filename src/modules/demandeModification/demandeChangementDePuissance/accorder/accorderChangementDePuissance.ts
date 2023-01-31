// import {
//   Repository,
//   TransactionalRepository,
//   TransactionalRepository,
//   UniqueEntityID,
// } from '@core/domain'
// import { errAsync, logger, okAsync } from '@core/utils'
import {
  ModificationRequest,
  PuissanceVariationWithDecisionJusticeError,
} from '@modules/modificationRequest'
import {
  AggregateHasBeenUpdatedSinceError,
  FichierDeRéponseObligatoireError,
  UnauthorizedError,
} from '@modules/shared'
import { userIsNot } from '@modules/users'
import { User } from '@entities'
// import { FileContents, FileObject, makeAndSaveFile } from '@modules/file'

import { errAsync, okAsync } from '@core/utils'
import { Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { FileContents } from '@modules/file'
import { Project } from '@modules/project'

type Commande = {
  demandeId: UniqueEntityID
  versionDate: Date
  utilisateur: User
  isDecisionJustice: boolean
  fichierRéponse?: { contents: FileContents; filename: string }
  nouvellePuissance: number
}

type Dépendances = {
  modificationRequestRepo: Repository<ModificationRequest> &
    TransactionalRepository<ModificationRequest>
  projectRepo: Repository<Project> & TransactionalRepository<Project>
}

export const makeAccorderChangementDePuissance =
  ({ modificationRequestRepo, projectRepo }: Dépendances) =>
  ({
    demandeId,
    utilisateur,
    versionDate,
    isDecisionJustice,
    fichierRéponse,
    nouvellePuissance,
  }: Commande) => {
    if (userIsNot(['admin', 'dgec-validateur', 'dreal'])(utilisateur)) {
      return errAsync(new UnauthorizedError())
    }

    if (!isDecisionJustice && !fichierRéponse) {
      return errAsync(new FichierDeRéponseObligatoireError())
    }

    return modificationRequestRepo.transaction(demandeId, (demande) => {
      if (demande.lastUpdatedOn && demande.lastUpdatedOn.getTime() !== versionDate.getTime()) {
        return errAsync(new AggregateHasBeenUpdatedSinceError())
      }

      return projectRepo.transaction(demande.projectId, (projet) => {
        const variationNouvellePuissanceInterdite =
          isDecisionJustice && nouvellePuissance / projet.puissanceInitiale > 1.1

        if (variationNouvellePuissanceInterdite) {
          return errAsync(new PuissanceVariationWithDecisionJusticeError())
        }

        return okAsync(null)
      })
    })
  }

// import { Project } from '@modules/project/Project'
// import { AggregateHasBeenUpdatedSinceError, InfraNotAvailableError } from '@modules/shared'
// import {
//   ModificationRequest,
//   PuissanceVariationWithDecisionJusticeError,
// } from '@modules/modificationRequest'

// type Dépendances = {
//   modificationRequestRepo: Repository<ModificationRequest> &
//     TransactionalRepository<ModificationRequest>
//   projectRepo: Repository<Project> & TransactionalRepository<Project>
//   fileRepo: Repository<FileObject>
// }

// type Commande = {
//   demandeId: UniqueEntityID
//   paramètres: { newPuissance: number; isDecisionJustice?: boolean }
//   versionDate: Date
//   fichierRéponse?: { contents: FileContents; filename: string }
//   utilisateur: User
// }

// export const makeAccorderChangementDePuissance =
//   ({ fileRepo, modificationRequestRepo, projectRepo }: Dépendances) =>
//   ({ demandeId, versionDate, fichierRéponse, utilisateur, paramètres }: Commande) => {
//     return okAsync(null)

//     return modificationRequestRepo
//       .load(demandeId)
//       .andThen((demande) => {
//         if (demande.lastUpdatedOn && demande.lastUpdatedOn.getTime() !== versionDate.getTime()) {
//           return errAsync(new AggregateHasBeenUpdatedSinceError())
//         }

//         return okAsync(demande)
//       })
//       .andThen((demande) =>
//         projectRepo
//           .load(demande.projectId)
//           .andThen((projet) => {
//             const { isDecisionJustice, newPuissance } = paramètres
//             const { puissanceInitiale } = projet
//             const newPuissanceVariationIsForbidden =
//               isDecisionJustice && newPuissance / puissanceInitiale > 1.1

//             if (newPuissanceVariationIsForbidden) {
//               return errAsync(new PuissanceVariationWithDecisionJusticeError())
//             }
//             return okAsync(projet)
//           })
//           .map((projet) => ({ projet, demande }))
//       )
//       .andThen(({ projet, demande }) => {
//         if (paramètres.isDecisionJustice && !fichierRéponse) {
//           return okAsync({ projet, demande })
//         }

//         return makeAndSaveFile({
//           file: {
//             designation: 'modification-request-response',
//             forProject: demande.projectId,
//             createdBy: new UniqueEntityID(utilisateur.id),
//             filename: fichierRéponse.filename,
//             contents: fichierRéponse.contents,
//           },
//           fileRepo,
//         })
//           .map((fichierRéponseId) => ({ projet, demande, fichierRéponseId }))
//           .mapErr((e) => {
//             logger.error(e)
//             return new InfraNotAvailableError()
//           })
//       })
//       .andThen(({ projet, demande, fichierRéponseId }) => {
//         return projet
//           .updatePuissance(utilisateur, paramètres.newPuissance)
//           .map(() => ({ projet, demande, fichierRéponseId }))
//       })
//       .andThen(({ projet, demande, fichierRéponseId }) => {
//         return demande
//           .accept({
//             acceptedBy: utilisateur,
//             params: { ...paramètres, type: 'puissance' },
//             responseFileId: fichierRéponseId,
//           })
//           .map(() => ({ projet, demande }))
//       })
//       .andThen(({ projet, demande }) => {
//         return projectRepo.save(projet).map(() => demande)
//       })
//       .andThen((demande) => {
//         return modificationRequestRepo.save(demande)
//       })
//   }
