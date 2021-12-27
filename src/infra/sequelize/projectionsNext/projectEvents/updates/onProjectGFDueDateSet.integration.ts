import { date } from 'yup/lib/locale'
import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectGFDueDateSet, ProjectGFDueDateSetPayload } from '../../../../../modules/project'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onProjectGFDueDateSet from './onProjectGFDueDateSet'

describe('onProjectGFDueDateSet', () => {
  const projectId = new UniqueEntityID().toString()
  const garantiesFinancieresDueOn = new Date(27 / 1 / 2022).getTime()
  const valueDate = new Date(27 / 11 / 2021)

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a new project event of type ProjectGFDueDateSet', async () => {
    await onProjectGFDueDateSet(
      new ProjectGFDueDateSet({
        payload: {
          projectId,
          garantiesFinancieresDueOn,
        } as ProjectGFDueDateSetPayload,
      })
    )

    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()
    expect(projectEvent).toMatchObject({
      type: 'ProjectGFDueDateSet',
    })
  })

  describe('when the event already exists in the projection ProjectEvent', () => {
    it('should not create a new project event of type ProjectGFDueDateSet', async () => {
      await ProjectEvent.create({
        id: new UniqueEntityID().toString(),
        projectId,
        type: 'ProjectGFDueDateSet',
        payload: { garantiesFinancieresDueOn },
        valueDate: valueDate.getTime(),
      })

      await onProjectGFDueDateSet(
        new ProjectGFDueDateSet({
          payload: {
            projectId,
            garantiesFinancieresDueOn,
          } as ProjectGFDueDateSetPayload,
          original: {
            version: 1,
            occurredAt: valueDate,
          },
        })
      )

      const projectEvents = await ProjectEvent.findAll({
        where: { projectId, type: 'ProjectGFDueDateSet', valueDate: valueDate.getTime() },
      })

      expect(projectEvents).toHaveLength(1)
      expect(projectEvents[0]).toMatchObject({
        payload: { garantiesFinancieresDueOn },
      })
    })
  })
})
