import { UniqueEntityID } from '../../../../core/domain'
import { User } from '../../../../entities'
import { USER_ROLES } from '../../../../modules/users'
import { resetDatabase } from '../../helpers'
import { ProjectEvent } from '../../projectionsNext'
import { getProjectEvents } from './getProjectEvents'

describe('frise.getProjectEvents', () => {
  const projectId = new UniqueEntityID().toString()

  for (const role of USER_ROLES.filter((role) => role === 'dgec' || role === 'admin')) {
    describe(`when the user is ${role}`, () => {
      it('should return the ProjectImported event', async () => {
        const fakeUser = { role } as User
        await resetDatabase()

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectImported',
          valueDate: 1234,
        })

        const res = await getProjectEvents({ projectId, user: fakeUser })

        expect(res._unsafeUnwrap()).toMatchObject({
          events: [
            {
              type: 'ProjectImported',
              date: 1234,
              variant: role,
            },
          ],
        })
      })
    })
  }

  for (const role of USER_ROLES.filter((role) => role !== 'dgec' && role !== 'admin')) {
    describe(`when the user is ${role}`, () => {
      it('should NOT return the ProjectImported event', async () => {
        const fakeUser = { role } as User
        await resetDatabase()

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectImported',
          valueDate: 1234,
        })

        const res = await getProjectEvents({ projectId, user: fakeUser })

        expect(res._unsafeUnwrap()).toMatchObject({
          events: [],
        })
      })
    })
  }

  for (const role of USER_ROLES.filter((role) => role !== 'ademe')) {
    describe(`when the user is ${role}`, () => {
      const fakeUser = { role } as User
      it('should return the ProjectNotified event', async () => {
        await resetDatabase()

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectNotified',
          valueDate: 1234,
        })

        const res = await getProjectEvents({ projectId, user: fakeUser })

        expect(res._unsafeUnwrap()).toMatchObject({
          events: [
            {
              type: 'ProjectNotified',
              date: 1234,
              variant: role,
            },
          ],
        })
      })
    })
  }

  describe(`when the user is ademe`, () => {
    const fakeUser = { role: 'ademe' } as User
    it('should not return the ProjectNotified event', async () => {
      await resetDatabase()

      await ProjectEvent.create({
        id: new UniqueEntityID().toString(),
        projectId,
        type: 'ProjectNotified',
        valueDate: 1234,
      })

      const res = await getProjectEvents({ projectId, user: fakeUser })

      expect(res._unsafeUnwrap()).toMatchObject({
        events: [],
      })
    })
  })

  for (const role of USER_ROLES.filter((role) => role !== 'ademe' && role !== 'dreal')) {
    describe(`when the user is ${role}`, () => {
      const fakeUser = { role } as User
      it('should return ProjectCertificateGenerated, ProjectCertificateRegenerated and ProjectCertificateUpdated events', async () => {
        await resetDatabase()

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectCertificateGenerated',
          valueDate: 1234,
        })

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectCertificateRegenerated',
          valueDate: 1234,
        })

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectCertificateUpdated',
          valueDate: 1234,
        })

        const res = await getProjectEvents({ projectId, user: fakeUser })

        expect(res._unsafeUnwrap()).toMatchObject({
          events: [
            {
              type: 'ProjectCertificateGenerated',
              date: 1234,
              variant: role,
            },
            {
              type: 'ProjectCertificateRegenerated',
              date: 1234,
              variant: role,
            },
            {
              type: 'ProjectCertificateUpdated',
              date: 1234,
              variant: role,
            },
          ],
        })
      })
    })
  }

  for (const role of USER_ROLES.filter((role) => role === 'ademe' || role === 'dreal')) {
    describe(`when the user is ${role}`, () => {
      const fakeUser = { role } as User
      it('should NOT return ProjectCertificateGenerated, ProjectCertificateRegenerated and ProjectCertificateUpdated events', async () => {
        await resetDatabase()

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectCertificateGenerated',
          valueDate: 1234,
        })

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectCertificateRegenerated',
          valueDate: 1234,
        })

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectCertificateUpdated',
          valueDate: 1234,
        })

        const res = await getProjectEvents({ projectId, user: fakeUser })

        expect(res._unsafeUnwrap()).toMatchObject({
          events: [],
        })
      })
    })
  }
})
