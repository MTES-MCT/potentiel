import { User } from '@entities'
import { EventStore, Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { DemandeAbandon } from '../DemandeAbandon'
import { errAsync } from '@core/utils'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { userIsNot } from '@modules/users'
import { FileContents, FileObject, makeAndSaveFile } from '@modules/file'
import { Project } from '@modules/project'

import { AbandonAccordé } from '../events'
import { AccorderDemandeAbandonError } from './AccorderDemandeAbandonError'

type AccorderDemandeAbandonProps = {
  user: User
  demandeAbandonId: string
  fichierRéponse: { contents: FileContents; filename: string }
}

type MakeAccorderDemandeAbandonProps = {
  demandeAbandonRepo: Repository<DemandeAbandon> & TransactionalRepository<DemandeAbandon>
  publishToEventStore: EventStore['publish']
  fileRepo: Repository<FileObject>
  projectRepo: Repository<Project>
}

export const makeAccorderDemandeAbandon =
  ({
    demandeAbandonRepo,
    publishToEventStore,
    fileRepo,
    projectRepo,
  }: MakeAccorderDemandeAbandonProps) =>
  ({ user, demandeAbandonId, fichierRéponse }: AccorderDemandeAbandonProps) => {
    if (userIsNot(['admin', 'dreal', 'dgec'])(user)) {
      return errAsync(new UnauthorizedError())
    }

    return demandeAbandonRepo
      .load(new UniqueEntityID(demandeAbandonId))
      .andThen((demandeAbandon) => {
        const { projetId } = demandeAbandon

        if (!projetId) {
          return errAsync(new InfraNotAvailableError())
        }

        return projectRepo
          .load(new UniqueEntityID(projetId))
          .map((project) => ({ project }))
          .andThen(({ project }) => {
            return demandeAbandonRepo.transaction(
              new UniqueEntityID(demandeAbandonId),
              (demandeAbandon) => {
                const { statut } = demandeAbandon

                if (statut !== 'envoyée' && statut !== 'en-instruction') {
                  return errAsync(
                    new AccorderDemandeAbandonError(
                      demandeAbandon,
                      'Seule une demande envoyée ou en instruction peut être accordée'
                    )
                  )
                }

                return makeAndSaveFile({
                  file: {
                    designation: 'modification-request-response',
                    forProject: new UniqueEntityID(projetId),
                    createdBy: new UniqueEntityID(user.id),
                    filename: fichierRéponse.filename,
                    contents: fichierRéponse.contents,
                  },
                  fileRepo,
                }).andThen((fichierRéponseId) => {
                  return publishToEventStore(
                    new AbandonAccordé({
                      payload: {
                        accordéPar: user.id,
                        projetId,
                        demandeAbandonId,
                        fichierRéponseId,
                      },
                    })
                  )
                })
              }
            )
          })
      })
  }
