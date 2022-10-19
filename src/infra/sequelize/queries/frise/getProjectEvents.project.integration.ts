import { UniqueEntityID } from '@core/domain'
import { User } from '@entities'
import { resetDatabase } from '../../helpers'
import { getProjectEvents } from './getProjectEvents'
import { models } from '../../models'
import makeFakeProject from '../../../../__tests__/fixtures/project'

describe('getProjectEvents project property', () => {
  const { Project } = models
  const projectId = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
  })

  describe(`when the project classe is 'Classé'`, () => {
    const fakeProject = makeFakeProject({ id: projectId, classe: 'Classé' })

    it('should return a project which is "Classé"', async () => {
      await Project.create(fakeProject)

      const fakeUser = { role: 'porteur-projet' } as User
      const res = await getProjectEvents({ projectId, user: fakeUser })

      expect(res._unsafeUnwrap()).toMatchObject({
        project: {
          id: projectId,
          status: 'Classé',
        },
      })
    })
  })

  describe(`when the project classe is 'Eliminé'`, () => {
    const fakeProject = makeFakeProject({ id: projectId, classe: 'Eliminé' })

    it('should return a project which is "Eliminé"', async () => {
      await Project.create(fakeProject)

      const fakeUser = { role: 'porteur-projet' } as User
      const res = await getProjectEvents({ projectId, user: fakeUser })

      expect(res._unsafeUnwrap()).toMatchObject({
        project: {
          id: projectId,
          status: 'Eliminé',
        },
      })
    })
  })

  describe(`when the project abandonedOn date is set`, () => {
    it('should return a project which is "Abandonné"', async () => {
      const abandonedOn = new Date('2021-01-01').getTime()
      const fakeProject = makeFakeProject({ id: projectId, classe: 'Classé', abandonedOn })
      await Project.create(fakeProject)
      const fakeUser = { role: 'porteur-projet' } as User

      const res = await getProjectEvents({ projectId, user: fakeUser })

      expect(res._unsafeUnwrap()).toMatchObject({
        project: {
          id: projectId,
          status: 'Abandonné',
        },
      })
    })
  })
})
