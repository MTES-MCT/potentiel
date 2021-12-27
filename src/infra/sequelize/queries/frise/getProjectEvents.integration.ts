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

  const { Project, File } = models
  const projectId = new UniqueEntityID().toString()
  const fakeProject = makeFakeProject({ id: projectId, potentielIdentifier: 'pot-id' })

  beforeEach(async () => {
    await resetDatabase()
    await Project.create(fakeProject)
  })

  it('should return events orderedby date', async () => {
    const user = { role: 'admin' } as User
    const date1 = 1
    const date2 = 10

    await ProjectEvent.create({
      id: new UniqueEntityID().toString(),
      projectId,
      type: 'ProjectImported',
      valueDate: date2,
    })
    await ProjectEvent.create({
      id: new UniqueEntityID().toString(),
      projectId,
      type: 'ProjectImported',
      valueDate: date1,
    })

    const res = await getProjectEvents({ projectId, user })

    expect(res._unsafeUnwrap().events).toHaveLength(2)
    expect(res._unsafeUnwrap().events).toMatchObject([
      {
        type: 'ProjectImported',
        date: date1,
      },
      {
        type: 'ProjectImported',
        date: date2,
      },
    ])
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
        const notifiedOnTimestamp = new Date('2022-01-05').getTime()
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
          valueDate: 1234,
          payload: { garantiesFinancieresDueOn: 5678 },
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
              date: 1234,
              variant: role,
              garantiesFinancieresDueOn: 5678,
            },
          ],
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
        valueDate: 1234,
        payload: { garantiesFinancieresDueOn: 5678 },
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
      it('should return ProjectGFSubmitted events', async () => {
        const gfTimestamp = new Date('2022-01-06').getTime()

        const fileId = new UniqueEntityID().toString()
        const gfDate = new Date(26 / 12 / 2021)
        const submissionDate = new Date(27 / 12 / 2021)
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectGFSubmitted',
          valueDate: gfTimestamp,
          eventPublishedAt: eventTimestamp,
          payload: {
            fileId: fileId,
            submittedBy: 'user-id',
            gfDate: Number(gfDate),
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
              type: 'ProjectGFSubmitted',
              date: gfTimestamp,
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
