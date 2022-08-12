import { UniqueEntityID } from '@core/domain'
import { User } from '@entities'
import { USER_ROLES } from '@modules/users'
import { resetDatabase } from '../../helpers'
import { ProjectEvent } from '../../projectionsNext'
import { getProjectEvents } from './getProjectEvents'
import { models } from '../../models'
import makeFakeProject from '../../../../__tests__/fixtures/project'

describe('getProjectEvents for GF events', () => {
  const eventTimestamp = new Date('2022-01-04').getTime()
  const GFDueDateTimestamp = new Date('2022-03-05').getTime()

  const { Project } = models
  const projectId = new UniqueEntityID().toString()
  const fakeProject = makeFakeProject({
    id: projectId,
    potentielIdentifier: 'pot-id',
    nomProjet: 'nom-du-projet',
  })

  beforeEach(async () => {
    await resetDatabase()
    await Project.create(fakeProject)
  })

  for (const role of USER_ROLES.filter((role) => role !== 'ademe')) {
    describe(`when the user is ${role}`, () => {
      const fakeUser = { role } as User
      it('should return the ProjectGFDueDateSet events', async () => {
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectGFDueDateSet',
          valueDate: GFDueDateTimestamp,
          eventPublishedAt: eventTimestamp,
        })

        const res = await getProjectEvents({ projectId, user: fakeUser })

        expect(res._unsafeUnwrap()).toMatchObject({
          events: [
            {
              type: 'ProjectGFDueDateSet',
              date: GFDueDateTimestamp,
              variant: role,
              nomProjet: 'nom-du-projet',
            },
          ],
        })
      })
    })
  }

  describe(`when the user is ademe`, () => {
    const fakeUser = { role: 'ademe' } as User
    it('should not return the ProjectGFDueDateSet events', async () => {
      await ProjectEvent.create({
        id: new UniqueEntityID().toString(),
        projectId,
        type: 'ProjectGFDueDateSet',
        valueDate: GFDueDateTimestamp,
        eventPublishedAt: eventTimestamp,
      })

      const res = await getProjectEvents({ projectId, user: fakeUser })

      expect(res._unsafeUnwrap()).toMatchObject({
        events: [],
      })
    })
  })

  for (const role of USER_ROLES.filter(
    (role) =>
      role === 'porteur-projet' ||
      role === 'admin' ||
      role === 'dgec-validateur' ||
      role === 'dreal'
  )) {
    const fakeUser = { role } as User
    describe(`when user is ${role}`, () => {
      it('should return ProjectGFSubmitted, ProjectGFRemoved, ProjectGFValidated, and ProjectGFInvalidated events', async () => {
        const fileId = new UniqueEntityID().toString()
        const gfDate = new Date('2021-12-26').getTime()
        const removedAt = new Date('2021-12-30').getTime()
        const validatedAt = new Date('2022-01-14').getTime()
        const invalidatedAt = new Date('2022-01-15').getTime()
        const expirationDate = new Date('2025-12-26').getTime()

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectGFSubmitted',
          valueDate: gfDate,
          eventPublishedAt: new Date('2021-12-27').getTime(),
          payload: {
            file: { id: fileId, name: 'my-file' },
            expirationDate,
          },
        })

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectGFRemoved',
          valueDate: removedAt,
          eventPublishedAt: removedAt,
        })

        await ProjectEvent.create({
          type: 'ProjectGFValidated',
          projectId,
          valueDate: validatedAt,
          eventPublishedAt: validatedAt,
          id: new UniqueEntityID().toString(),
        })

        await ProjectEvent.create({
          type: 'ProjectGFInvalidated',
          projectId,
          valueDate: invalidatedAt,
          eventPublishedAt: invalidatedAt,
          id: new UniqueEntityID().toString(),
        })

        const res = await getProjectEvents({ projectId, user: fakeUser })

        expect(res._unsafeUnwrap().events).toHaveLength(4)
        expect(res._unsafeUnwrap()).toMatchObject({
          events: [
            {
              type: 'ProjectGFSubmitted',
              date: gfDate,
              variant: role,
              file: { id: fileId, name: 'my-file' },
              expirationDate,
            },
            {
              type: 'ProjectGFRemoved',
              date: removedAt,
              variant: role,
            },
            {
              type: 'ProjectGFValidated',
              date: validatedAt,
              variant: role,
            },
            {
              type: 'ProjectGFInvalidated',
              date: invalidatedAt,
              variant: role,
            },
          ],
        })
      })
    })
  }

  for (const role of USER_ROLES.filter(
    (role) =>
      role === 'porteur-projet' ||
      role === 'admin' ||
      role === 'dgec-validateur' ||
      role === 'dreal'
  )) {
    const fakeUser = { role } as User
    describe(`when user is ${role}`, () => {
      it('should return ProjectGFUploaded and ProjectGFWithdrawn events', async () => {
        const fileId = new UniqueEntityID().toString()
        const gfDate = new Date('2021-12-26').getTime()
        const expirationDate = new Date('2025-12-26').getTime()

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectGFUploaded',
          valueDate: gfDate,
          eventPublishedAt: new Date('2021-12-27').getTime(),
          payload: {
            file: { id: fileId, name: 'my-file' },
            expirationDate,
            uploadedByRole: 'porteur-projet',
          },
        })

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectGFWithdrawn',
          valueDate: new Date('2021-12-28').getTime(),
          eventPublishedAt: new Date('2021-12-28').getTime(),
        })

        const res = await getProjectEvents({ projectId, user: fakeUser })

        expect(res._unsafeUnwrap().events).toHaveLength(2)
        expect(res._unsafeUnwrap()).toMatchObject({
          events: [
            {
              type: 'ProjectGFUploaded',
              date: gfDate,
              variant: role,
              file: { id: fileId, name: 'my-file' },
              expirationDate,
              uploadedByRole: 'porteur-projet',
            },
            {
              type: 'ProjectGFWithdrawn',
              date: new Date('2021-12-28').getTime(),
              variant: role,
            },
          ],
        })
      })
    })
  }

  for (const role of USER_ROLES.filter(
    (role) =>
      role !== 'porteur-projet' &&
      role !== 'admin' &&
      role !== 'dgec-validateur' &&
      role !== 'dreal'
  )) {
    const fakeUser = { role } as User
    describe(`when user is ${role}`, () => {
      it('should NOT return ProjectGFSubmitted, ProjectGFRemoved and, ProjectGFInvalidated and ProjectGFValidated events', async () => {
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectGFSubmitted',
          valueDate: new Date('2021-12-26').getTime(),
          eventPublishedAt: new Date('2021-12-27').getTime(),
          payload: {
            fileId: new UniqueEntityID().toString(),
            filename: 'my-file',
          },
        })

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectGFRemoved',
          valueDate: new Date('2021-12-30').getTime(),
          eventPublishedAt: new Date('2021-12-30').getTime(),
        })

        await ProjectEvent.create({
          type: 'ProjectGFValidated',
          projectId,
          valueDate: new Date('2021-12-30').getTime(),
          eventPublishedAt: new Date('2021-12-30').getTime(),
          id: new UniqueEntityID().toString(),
        })

        await ProjectEvent.create({
          type: 'ProjectGFInvalidated',
          projectId,
          valueDate: new Date('2021-12-30').getTime(),
          eventPublishedAt: new Date('2021-12-30').getTime(),
          id: new UniqueEntityID().toString(),
        })

        const res = await getProjectEvents({ projectId, user: fakeUser })

        expect(res._unsafeUnwrap().events).toHaveLength(0)
        expect(res._unsafeUnwrap()).toMatchObject({ events: [] })
      })
    })
  }
})
