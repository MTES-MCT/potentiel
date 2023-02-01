import {
  ModificationRequest,
  StatusPreventsAcceptingError,
  VariationPuissanceInterditDecisionJusticeError,
} from '@modules/modificationRequest'
import {
  AggregateHasBeenUpdatedSinceError,
  FichierDeRéponseObligatoireError,
  ProjetNonClasséError,
  UnauthorizedError,
} from '@modules/shared'
import { userIsNot } from '@modules/users'
import { User } from '@entities'

import { errAsync } from '@core/utils'
import { EventStore, Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { FileContents, FileObject, makeAndSaveFile } from '@modules/file'
import { Project } from '@modules/project'
import { ChangementDePuissanceAccordé } from '../events'

type Dépendances = {
  modificationRequestRepo: Repository<ModificationRequest> &
    TransactionalRepository<ModificationRequest>
  projectRepo: Repository<Project> & TransactionalRepository<Project>
  fileRepo: Repository<FileObject>
  publishToEventStore: EventStore['publish']
}

type Commande = {
  demandeId: UniqueEntityID
  versionDate: Date
  utilisateur: User
  isDecisionJustice: boolean
  fichierRéponse?: { contents: FileContents; filename: string }
  nouvellePuissance: number
}

export const makeAccorderChangementDePuissance =
  ({ modificationRequestRepo, projectRepo, fileRepo, publishToEventStore }: Dépendances) =>
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

    return modificationRequestRepo.transaction(demandeId, (demande) => {
      if (demande.lastUpdatedOn && demande.lastUpdatedOn.getTime() !== versionDate.getTime()) {
        return errAsync(new AggregateHasBeenUpdatedSinceError())
      }

      if (
        !['envoyée', 'en attente de confirmation', 'demande confirmée'].includes(demande.status)
      ) {
        return errAsync(new StatusPreventsAcceptingError(demande.status))
      }

      return projectRepo.transaction(demande.projectId, (projet) => {
        if (!projet.isClasse) {
          return errAsync(new ProjetNonClasséError())
        }

        const variationNouvellePuissanceInterdite =
          isDecisionJustice && nouvellePuissance / projet.puissanceInitiale > 1.1

        if (variationNouvellePuissanceInterdite) {
          return errAsync(new VariationPuissanceInterditDecisionJusticeError())
        }

        if (isDecisionJustice && !fichierRéponse) {
          return publishToEventStore(
            new ChangementDePuissanceAccordé({
              payload: {
                demandeId: demande.id.toString(),
                nouvellePuissance,
                accordéPar: utilisateur.id,
                projetId: projet.id.toString(),
                fichierRéponseId: undefined,
              },
            })
          )
        }

        if (!fichierRéponse) {
          return errAsync(new FichierDeRéponseObligatoireError())
        }

        return makeAndSaveFile({
          file: {
            designation: 'modification-request-response',
            forProject: projet.id,
            createdBy: new UniqueEntityID(utilisateur.id),
            filename: fichierRéponse.filename,
            contents: fichierRéponse.contents,
          },
          fileRepo,
        }).andThen((fichierRéponseId) =>
          publishToEventStore(
            new ChangementDePuissanceAccordé({
              payload: {
                demandeId: demande.id.toString(),
                nouvellePuissance,
                accordéPar: utilisateur.id,
                projetId: projet.id.toString(),
                fichierRéponseId,
              },
            })
          )
        )
      })
    })
  }
