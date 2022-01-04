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
      it('should return the ProjectNotified event', async () => {
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectNotified',
          valueDate: eventTimestamp,
          eventPublishedAt: eventTimestamp,
        })

        const res = await getProjectEvents({ projectId, user: fakeUser })

        expect(res._unsafeUnwrap()).toMatchObject({
          events: [
            {
              type: 'ProjectNotified',
              date: eventTimestamp,
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
      await ProjectEvent.create({
        id: new UniqueEntityID().toString(),
        projectId,
        type: 'ProjectNotified',
        valueDate: eventTimestamp,
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
      it('should return ProjectGFSubmitted events', async () => {
        const fileId = new UniqueEntityID().toString()
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectGFSubmitted',
          valueDate: eventTimestamp,
          eventPublishedAt: eventTimestamp,
          payload: {
            fileId: fileId,
            submittedBy: 'someone',
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
              date: eventTimestamp,
              variant: role,
              fileId: fileId,
              submittedBy: 'someone',
              filename: 'my-file-name',
            },
          ],
        })
      })
    })
  }
})
