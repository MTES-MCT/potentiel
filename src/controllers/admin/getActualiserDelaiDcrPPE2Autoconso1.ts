import { ensureRole, eventStore } from '@config'
import asyncHandler from '../helpers/asyncHandler'
import { v1Router } from '../v1Router'
import { models } from '../../infra/sequelize/models'
import { combine, ResultAsync } from '@core/utils'
import { InfraNotAvailableError } from '@modules/shared'
import { ProjectDCRDueDateSet } from '@modules/project'

const { Project } = models

v1Router.get(
  '/admin/actualiser-delai-dcr-PPE2-autoconso1',
  ensureRole(['admin']),
  asyncHandler(async (request, response) => {
    ResultAsync.fromPromise(
      Project.findAll({
        where: {
          appelOffreId: 'PPE2 - Autoconsommation métropole',
          periodeId: '1',
          classe: 'Classé',
        },
        attributes: ['id', 'notifiedOn'],
      }),
      () => new InfraNotAvailableError()
    ).andThen((projects: { id: string; notifiedOn: number }[]) =>
      combine(
        projects.map(({ id: projectId, notifiedOn }) => {
          const notifiedOnDate = new Date(notifiedOn)
          return eventStore.publish(
            new ProjectDCRDueDateSet({
              payload: {
                projectId,
                dcrDueOn: notifiedOnDate.setMonth(notifiedOnDate.getMonth() + 2),
              },
            })
          )
        })
      )
    )
  })
)
