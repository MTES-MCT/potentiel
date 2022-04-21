import { resetDatabase } from '../../../helpers'
import { DemandeDelaiSignaled } from '@modules/project'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import models from '../../../models'
import { onDemandeDelaiSignaled } from './onDemandeDelaiSignaled'
import { v4 as uuid } from 'uuid'

describe('project.onDemandeDelaiSignaled', () => {
  const projectId = uuid()

  const fakeProject = makeFakeProject({
    id: projectId,
    completionDueOn: 0,
  })

  const ProjectModel = models.Project

  beforeEach(async () => {
    await resetDatabase()
    await ProjectModel.create(fakeProject)
  })

  describe(`when the request was accepted and the new completion date applicable`, () => {
    it('should update project.completionDueOn', async () => {
      await onDemandeDelaiSignaled(models)(
        new DemandeDelaiSignaled({
          payload: {
            projectId,
            decidedOn: 67890,
            status: 'acceptée',
            isNewDateApplicable: true,
            newCompletionDueOn: 12345,
            signaledBy: 'fake-user',
            attachments: [],
          },
        })
      )

      const updatedProject = await ProjectModel.findByPk(projectId)
      expect(updatedProject.completionDueOn).toEqual(12345)
    })
  })

  describe(`when the request was refused and the new completion date applicable`, () => {
    it('should not update project.completionDueOn', async () => {
      await onDemandeDelaiSignaled(models)(
        new DemandeDelaiSignaled({
          payload: {
            projectId,
            decidedOn: 67890,
            status: 'rejetée',
            signaledBy: 'fake-user',
            attachments: [],
          },
        })
      )

      const updatedProject = await ProjectModel.findByPk(projectId)
      expect(updatedProject.completionDueOn).toEqual(0)
    })
  })

  describe(`when the request was accepted but the new completion date was not applicable`, () => {
    it('should not update project.completionDueOn', async () => {
      await onDemandeDelaiSignaled(models)(
        new DemandeDelaiSignaled({
          payload: {
            projectId,
            decidedOn: 67890,
            status: 'acceptée',
            isNewDateApplicable: false,
            newCompletionDueOn: 12345,
            signaledBy: 'fake-user',
            attachments: [],
          },
        })
      )

      const updatedProject = await ProjectModel.findByPk(projectId)
      expect(updatedProject.completionDueOn).toEqual(0)
    })
  })
})
