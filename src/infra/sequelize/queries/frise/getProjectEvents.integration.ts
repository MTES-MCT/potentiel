import { UniqueEntityID } from '../../../../core/domain'
import { User } from '../../../../entities'
import { USER_ROLES } from '../../../../modules/users'
import { resetDatabase } from '../../helpers'
import { ProjectEvent } from '../../projectionsNext'
import { getProjectEvents } from './getProjectEvents'
import { models } from '../../models'
import makeFakeProject from '../../../../__tests__/fixtures/project'

describe('frise.getProjectEvents', () => {
  const eventTimestamp = new Date('2022-01-04').getTime()
  const notifiedOnTimestamp = new Date('2022-01-05').getTime()
  const GFDueDateTimestamp = new Date('2022-03-05').getTime()

  const { Project } = models
  const projectId = new UniqueEntityID().toString()
  const fakeProject = makeFakeProject({ id: projectId, potentielIdentifier: 'pot-id' })

  beforeEach(async () => {
    await resetDatabase()
    await Project.create(fakeProject)
  })

  for (const role of USER_ROLES.filter((role) => role === 'dgec' || role === 'admin')) {
    describe(`when the user is ${role}`, () => {
      it('should return the ProjectImported event', async () => {
        const fakeUser = { role } as User
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectImported',
          valueDate: eventTimestamp,
          eventPublishedAt: eventTimestamp,
        })

        const res = await getProjectEvents({ projectId, user: fakeUser })

        expect(res._unsafeUnwrap()).toMatchObject({
          events: [
            {
              type: 'ProjectImported',
              date: eventTimestamp,
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
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectImported',
          valueDate: eventTimestamp,
          eventPublishedAt: eventTimestamp,
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
      it('should return the ProjectNotified and ProjectGFDueDateSet events', async () => {
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectNotified',
          valueDate: notifiedOnTimestamp,
          eventPublishedAt: eventTimestamp,
        })
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
              type: 'ProjectNotified',
              date: notifiedOnTimestamp,
              variant: role,
            },
            {
              type: 'ProjectGFDueDateSet',
              date: GFDueDateTimestamp,
              variant: role,
            },
          ],
        })
      })

      describe(`when there is a ProjectImported with a notification date`, () => {
        it('should return a ProjectNotified with isLegacy "true"', async () => {
          await ProjectEvent.create({
            id: new UniqueEntityID().toString(),
            projectId,
            type: 'ProjectImported',
            valueDate: eventTimestamp,
            eventPublishedAt: eventTimestamp,
            payload: {
              notifiedOn: notifiedOnTimestamp,
            },
          })

          const res = await getProjectEvents({ projectId, user: fakeUser })

          expect(res._unsafeUnwrap()).toMatchObject({
            events: expect.arrayContaining([
              {
                type: 'ProjectNotified',
                date: notifiedOnTimestamp,
                variant: role,
                isLegacy: true,
              },
            ]),
          })
        })
      })
    })
  }

  describe(`when the user is ademe`, () => {
    const fakeUser = { role: 'ademe' } as User
    it('should not return the ProjectNotified and ProjectGFDueDateSet events', async () => {
      await ProjectEvent.create({
        id: new UniqueEntityID().toString(),
        projectId,
        type: 'ProjectNotified',
        valueDate: eventTimestamp,
        eventPublishedAt: eventTimestamp,
      })
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

  for (const role of USER_ROLES.filter((role) => role !== 'ademe' && role !== 'dreal')) {
    describe(`when the user is ${role}`, () => {
      const fakeUser = { role } as User
      it('should return ProjectCertificateGenerated, ProjectCertificateRegenerated, ProjectCertificateUpdated and ProjectClaimed events', async () => {
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectCertificateGenerated',
          valueDate: eventTimestamp,
          eventPublishedAt: eventTimestamp,
          payload: { certificateFileId: 'fileId' },
        })

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectCertificateRegenerated',
          valueDate: eventTimestamp,
          eventPublishedAt: eventTimestamp,
          payload: { certificateFileId: 'fileId' },
        })

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectCertificateUpdated',
          valueDate: eventTimestamp,
          eventPublishedAt: eventTimestamp,
          payload: { certificateFileId: 'fileId' },
        })

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectClaimed',
          valueDate: eventTimestamp,
          eventPublishedAt: eventTimestamp,
          payload: {
            attestationDesignationFileId: 'file-id',
            claimedBy: 'someone',
          },
        })

        const res = await getProjectEvents({ projectId, user: fakeUser })

        expect(res._unsafeUnwrap()).toMatchObject({
          events: [
            {
              type: 'ProjectCertificateGenerated',
              potentielIdentifier: fakeProject.potentielIdentifier,
              email: ['admin', 'dgec'].includes(role) ? fakeProject.email : undefined,
              nomProjet: fakeProject.nomProjet,
              date: eventTimestamp,
              variant: role,
              certificateFileId: 'fileId',
            },
            {
              type: 'ProjectCertificateRegenerated',
              potentielIdentifier: fakeProject.potentielIdentifier,
              email: ['admin', 'dgec'].includes(role) ? fakeProject.email : undefined,
              nomProjet: fakeProject.nomProjet,
              date: eventTimestamp,
              variant: role,
              certificateFileId: 'fileId',
            },
            {
              type: 'ProjectCertificateUpdated',
              potentielIdentifier: fakeProject.potentielIdentifier,
              email: ['admin', 'dgec'].includes(role) ? fakeProject.email : undefined,
              nomProjet: fakeProject.nomProjet,
              date: eventTimestamp,
              variant: role,
              certificateFileId: 'fileId',
            },
            {
              type: 'ProjectClaimed',
              potentielIdentifier: fakeProject.potentielIdentifier,
              nomProjet: fakeProject.nomProjet,
              date: eventTimestamp,
              variant: role,
              certificateFileId: 'file-id',
              claimedBy: 'someone',
            },
          ],
        })
      })
    })
  }

  for (const role of USER_ROLES.filter((role) => role === 'ademe' || role === 'dreal')) {
    describe(`when the user is ${role}`, () => {
      const fakeUser = { role } as User
      it('should NOT return ProjectCertificateGenerated, ProjectCertificateRegenerated, ProjectCertificateUpdated and ProjectClaimed events', async () => {
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectCertificateGenerated',
          valueDate: eventTimestamp,
          eventPublishedAt: eventTimestamp,
          payload: { certificateFileId: 'fileId' },
        })

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectCertificateRegenerated',
          valueDate: eventTimestamp,
          eventPublishedAt: eventTimestamp,
          payload: { certificateFileId: 'fileId' },
        })

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectCertificateUpdated',
          valueDate: eventTimestamp,
          eventPublishedAt: eventTimestamp,
          payload: { certificateFileId: 'fileId' },
        })

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectClaimed',
          valueDate: eventTimestamp,
          eventPublishedAt: eventTimestamp,
          payload: {
            attestationDesignationFileId: 'file-id',
            claimedBy: 'someone',
          },
        })

        const res = await getProjectEvents({ projectId, user: fakeUser })

        expect(res._unsafeUnwrap()).toMatchObject({
          events: [],
        })
      })
    })
  }

  for (const role of USER_ROLES.filter(
    (role) => role === 'porteur-projet' || role === 'admin' || role === 'dgec' || role === 'dreal'
  )) {
    const fakeUser = { role } as User
    describe(`when user is ${role}`, () => {
      it('should return ProjectGFSubmitted, ProjectGFRemoved, ProjectGFValidated, and ProjectGFInvalidated events', async () => {
        const fileId = new UniqueEntityID().toString()
        const gfDate = new Date('2021-12-26').getTime()
        const removedAt = new Date('2021-12-30').getTime()
        const validatedAt = new Date('2022-01-14').getTime()
        const invalidatedAt = new Date('2022-01-15').getTime()

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectGFSubmitted',
          valueDate: gfDate,
          eventPublishedAt: new Date('2021-12-27').getTime(),
          payload: {
            fileId: fileId,
            filename: 'my-file',
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
              fileId: fileId,
              filename: 'my-file',
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
    (role) => role !== 'porteur-projet' && role !== 'admin' && role !== 'dgec' && role !== 'dreal'
  )) {
    const fakeUser = { role } as User
    describe(`when user is ${role}`, () => {
      it('should NOT return ProjectGFSubmitted, ProjectGFRemoved and, ProjectGFInvalidated and ProjectGFValidated for GF events', async () => {
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

  it('should return events sorted by eventPublishedAt date', async () => {
    const fakeUser = { role: 'porteur-projet' } as User

    await ProjectEvent.create({
      id: new UniqueEntityID().toString(),
      projectId,
      type: 'ProjectCertificateGenerated',
      valueDate: eventTimestamp,
      eventPublishedAt: new Date('2022-01-01').getTime(),
      payload: { certificateFileId: 'fileId' },
    })

    await ProjectEvent.create({
      id: new UniqueEntityID().toString(),
      projectId,
      type: 'ProjectCertificateRegenerated',
      valueDate: eventTimestamp,
      eventPublishedAt: new Date('2022-01-03').getTime(),
      payload: { certificateFileId: 'fileId' },
    })

    await ProjectEvent.create({
      id: new UniqueEntityID().toString(),
      projectId,
      type: 'ProjectCertificateUpdated',
      valueDate: eventTimestamp,
      eventPublishedAt: new Date('2022-01-04').getTime(),
      payload: { certificateFileId: 'fileId' },
    })

    await ProjectEvent.create({
      id: new UniqueEntityID().toString(),
      projectId,
      type: 'ProjectClaimed',
      valueDate: eventTimestamp,
      eventPublishedAt: new Date('2022-01-02').getTime(),
      payload: {
        attestationDesignationFileId: 'file-id',
        claimedBy: 'someone',
      },
    })

    const res = await getProjectEvents({ projectId, user: fakeUser })

    expect(res._unsafeUnwrap()).toMatchObject({
      events: [
        {
          type: 'ProjectCertificateGenerated',
        },
        {
          type: 'ProjectClaimed',
        },
        {
          type: 'ProjectCertificateRegenerated',
        },
        {
          type: 'ProjectCertificateUpdated',
        },
      ],
    })
  })
})
