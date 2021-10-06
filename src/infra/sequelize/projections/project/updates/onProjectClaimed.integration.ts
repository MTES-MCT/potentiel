import { resetDatabase } from '../../../helpers'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import models from '../../../models'
import { UniqueEntityID } from '../../../../../core/domain'
import { onProjectClaimed } from './onProjectClaimed'
import { ProjectClaimed, ProjectClaimedByOwner } from '../../../../../modules/projectClaim'

describe('project.onProjectClaimed', () => {
  const projectId = new UniqueEntityID().toString()

  const fakeProjects = [
    {
      id: projectId,
      email: 'old@test.test',
    },
  ].map(makeFakeProject)

  const { Project } = models

  describe('on ProjectClaimed', () => {
    beforeAll(async () => {
      await resetDatabase()
      await Project.bulkCreate(fakeProjects)

      const originalProject = await Project.findByPk(projectId)
      expect(originalProject.email).toEqual('old@test.test')

      await onProjectClaimed(models)(
        new ProjectClaimed({
          payload: {
            projectId: projectId,
            claimedBy: new UniqueEntityID().toString(),
            claimerEmail: 'new@test.test',
            attestationDesignationFileId: new UniqueEntityID().toString(),
          },
        })
      )
    })

    it('should udpdate the project email', async () => {
      const updatedProject = await Project.findByPk(projectId)
      expect(updatedProject.email).toEqual('new@test.test')
    })
  })

  describe('on ProjectClaimedByOwner', () => {
    beforeAll(async () => {
      await resetDatabase()
      await Project.bulkCreate(fakeProjects)

      const originalProject = await Project.findByPk(projectId)
      expect(originalProject.email).toEqual('old@test.test')

      await onProjectClaimed(models)(
        new ProjectClaimedByOwner({
          payload: {
            projectId: projectId,
            claimedBy: new UniqueEntityID().toString(),
            claimerEmail: 'new@test.test',
          },
        })
      )
    })

    it('should udpdate the project email', async () => {
      const updatedProject = await Project.findByPk(projectId)
      expect(updatedProject.email).toEqual('new@test.test')
    })
  })
})
