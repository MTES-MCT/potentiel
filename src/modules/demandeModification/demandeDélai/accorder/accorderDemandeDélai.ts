import { User } from '@entities'
import { EventStore, Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { DemandeDélai } from '../DemandeDélai'
import { errAsync, ResultAsync } from '@core/utils'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { userIsNot } from '@modules/users'
import { FileContents, FileObject, makeAndSaveFile } from '@modules/file'
import { Project } from '@modules/project'

import { DélaiAccordé } from '../events/DélaiAccordé'

import { AccorderDemandeDélaiError, AccorderDateAchèvementAntérieureDateThéoriqueError } from '.'

type AccorderDemandeDélai = (commande: {
  user: User
  demandeDélaiId: string
  dateAchèvementAccordée: Date
  fichierRéponse: { contents: FileContents; filename: string }
}) => ResultAsync<
  null,
  InfraNotAvailableError | UnauthorizedError | AccorderDateAchèvementAntérieureDateThéoriqueError
>

type MakeAccorderDemandeDélai = (dépendances: {
  demandeDélaiRepo: Repository<DemandeDélai> & TransactionalRepository<DemandeDélai>
  publishToEventStore: EventStore['publish']
  fileRepo: Repository<FileObject>
  projectRepo: Repository<Project>
}) => AccorderDemandeDélai

export const makeAccorderDemandeDélai: MakeAccorderDemandeDélai =
  ({ demandeDélaiRepo, publishToEventStore, fileRepo, projectRepo }) =>
  ({ user, demandeDélaiId, dateAchèvementAccordée, fichierRéponse }) => {
    if (userIsNot(['admin', 'dreal', 'dgec'])(user)) {
      return errAsync(new UnauthorizedError())
    }

    return demandeDélaiRepo.load(new UniqueEntityID(demandeDélaiId)).andThen((demandeDélai) => {
      const { projetId } = demandeDélai

      if (!projetId) {
        return errAsync(new InfraNotAvailableError())
      }

      return projectRepo
        .load(new UniqueEntityID(demandeDélai.projetId))
        .map((project) => ({ project }))
        .andThen(({ project }) => {
          if (dateAchèvementAccordée.getTime() <= project.completionDueOn) {
            return errAsync(
              new AccorderDateAchèvementAntérieureDateThéoriqueError(
                dateAchèvementAccordée,
                new Date(project.completionDueOn)
              )
            )
          }

          return demandeDélaiRepo.transaction(
            new UniqueEntityID(demandeDélaiId),
            (demandeDélai) => {
              const { statut } = demandeDélai

              if (statut !== 'envoyée' && statut !== 'en-instruction') {
                return errAsync(
                  new AccorderDemandeDélaiError(
                    demandeDélai,
                    'Seul une demande envoyée ou en instruction peut être accordée'
                  )
                )
              }

              return makeAndSaveFile({
                file: {
                  designation: 'modification-request-response',
                  forProject: new UniqueEntityID(demandeDélai.projetId),
                  createdBy: new UniqueEntityID(user.id),
                  filename: fichierRéponse.filename,
                  contents: fichierRéponse.contents,
                },
                fileRepo,
              }).andThen((fichierRéponseId) => {
                return publishToEventStore(
                  new DélaiAccordé({
                    payload: {
                      accordéPar: user.id,
                      projetId,
                      dateAchèvementAccordée: dateAchèvementAccordée.toISOString(),
                      demandeDélaiId,
                      fichierRéponseId,
                      ancienneDateThéoriqueAchèvement: new Date(
                        project.completionDueOn
                      ).toISOString(),
                    },
                  })
                )
              })
            }
          )
        })
    })
  }
