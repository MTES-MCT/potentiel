import { UniqueEntityID } from '../../../../core/domain'
import { User } from '../../../../entities'
import { USER_ROLES } from '../../../../modules/users'
import { resetDatabase } from '../../helpers'
import { ProjectEvent } from '../../projectionsNext'
import { getProjectEvents } from './getProjectEvents'
import { models } from '../../models'
import makeFakeProject from '../../../../__tests__/fixtures/project'

describe('getProjectEvents for DCR events', () => {
  const eventTimestamp = new Date('2022-01-04').getTime()
  const dcrDateTimestamp = new Date('2022-03-05').getTime()

  const { Project, File } = models
  const projectId = new UniqueEntityID().toString()
  const fakeProject = makeFakeProject({ id: projectId, potentielIdentifier: 'pot-id' })

  beforeEach(async () => {
    await resetDatabase()
    await Project.create(fakeProject)
  })

  for (const role of USER_ROLES.filter((role) => role !== 'ademe')) {
    describe(`when the user is ${role}`, () => {
      const fakeUser = { role } as User
      it('should return the ProjectDCRDueDateSet events', async () => {
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectDCRDueDateSet',
          valueDate: dcrDateTimestamp,
          eventPublishedAt: eventTimestamp,
        })

        const res = await getProjectEvents({ projectId, user: fakeUser })

        expect(res._unsafeUnwrap()).toMatchObject({
          events: [
            {
              type: 'ProjectDCRDueDateSet',
              date: dcrDateTimestamp,
              variant: role,
            },
          ],
        })
      })
    })
  }

  describe(`when the user is ademe`, () => {
    const fakeUser = { role: 'ademe' } as User
    it('should not return the ProjectDCRDueDateSet events', async () => {
      await ProjectEvent.create({
        id: new UniqueEntityID().toString(),
        projectId,
        type: 'ProjectDCRDueDateSet',
        valueDate: dcrDateTimestamp,
        eventPublishedAt: eventTimestamp,
      })

      const res = await getProjectEvents({ projectId, user: fakeUser })

      expect(res._unsafeUnwrap()).toMatchObject({
        events: [],
      })
    })
  })

  for (const role of USER_ROLES.filter(
    (role) => role === 'porteur-projet' || role === 'admin' || role === 'dgec' || role === 'dreal'
  )) {
    const fakeUser = { role } as User
    describe(`when user is ${role}`, () => {
      it('should return ProjectDCRSubmitted events', async () => {
        const fileId = new UniqueEntityID().toString()
        const gfDate = new Date('2021-12-26').getTime()
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectDCRSubmitted',
          valueDate: gfDate,
          eventPublishedAt: eventTimestamp,
          payload: {
            fileId: fileId,
            submittedBy: 'user-id',
          },
        })
        await File.create({
          id: fileId,
          filename: 'my-file-name',
          designation: 'designation',
        })
        const res = await getProjectEvents({ projectId, user: fakeUser })
        expect(res._unsafeUnwrap()).toMatchObject({
          events: [
            {
              type: 'ProjectDCRSubmitted',
              date: gfDate,
              variant: role,
              fileId: fileId,
              submittedBy: 'user-id',
              filename: 'my-file-name',
            },
          ],
        })
      })
    })
  }
})
