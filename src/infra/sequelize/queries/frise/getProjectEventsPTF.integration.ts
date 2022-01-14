import { UniqueEntityID } from '../../../../core/domain'
import { User } from '../../../../entities'
import { USER_ROLES } from '../../../../modules/users'
import { resetDatabase } from '../../helpers'
import { ProjectEvent } from '../../projectionsNext'
import { getProjectEvents } from './getProjectEvents'
import { models } from '../../models'
import makeFakeProject from '../../../../__tests__/fixtures/project'

describe('getProjectEvents for PTF events', () => {
  const eventTimestamp = new Date('2022-01-04').getTime()

  const { Project, File } = models
  const projectId = new UniqueEntityID().toString()
  const fakeProject = makeFakeProject({ id: projectId, potentielIdentifier: 'pot-id' })

  beforeEach(async () => {
    await resetDatabase()
    await Project.create(fakeProject)
  })

  describe(`when there is some ProjectPTFSubmitted events`, () => {
    describe(`when the user is NOT ademe or acheteur-obligé`, () => {
      for (const role of USER_ROLES.filter(
        (role) =>
          role === 'porteur-projet' || role === 'admin' || role === 'dgec' || role === 'dreal'
      )) {
        const fakeUser = { role } as User
        describe(`when user is ${role}`, () => {
          it('should return ProjectPTFSubmitted events', async () => {
            const fileId = new UniqueEntityID().toString()
            const dcrDate = new Date('2021-12-26').getTime()
            await ProjectEvent.create({
              id: new UniqueEntityID().toString(),
              projectId,
              type: 'ProjectPTFSubmitted',
              valueDate: dcrDate,
              eventPublishedAt: eventTimestamp,
              payload: {
                fileId: fileId,
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
                  type: 'ProjectPTFSubmitted',
                  date: dcrDate,
                  variant: role,
                  fileId: fileId,
                  filename: 'my-file-name',
                },
              ],
            })
          })
        })
      }
    })
  })

  describe(`when there is some ProjectPTFRemoved events`, () => {
    describe(`when the user is NOT ademe or acheteur-obligé`, () => {
      for (const role of USER_ROLES.filter(
        (role) =>
          role === 'porteur-projet' || role === 'admin' || role === 'dgec' || role === 'dreal'
      )) {
        const fakeUser = { role } as User
        describe(`when user is ${role}`, () => {
          it('should return ProjectPTFRemoved events', async () => {
            const dcrDate = new Date('2021-12-26').getTime()
            await ProjectEvent.create({
              id: new UniqueEntityID().toString(),
              projectId,
              type: 'ProjectPTFRemoved',
              valueDate: dcrDate,
              eventPublishedAt: eventTimestamp,
            })

            const res = await getProjectEvents({ projectId, user: fakeUser })

            expect(res._unsafeUnwrap()).toMatchObject({
              events: [
                {
                  type: 'ProjectPTFRemoved',
                  date: dcrDate,
                  variant: role,
                },
              ],
            })
          })
        })
      }
    })
  })
})
