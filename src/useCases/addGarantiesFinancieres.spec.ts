import moment from 'moment'
import { Readable } from 'stream'
import { Repository } from '../core/domain'
import { okAsync } from '../core/utils'
import { makeProject, makeProjectAdmissionKey, makeUser, Project } from '../entities'
import { EventBus, StoredEvent } from '../modules/eventStore'
import { FileObject } from '../modules/file'
import { ProjectGFSubmitted } from '../modules/project/events'
import { InfraNotAvailableError } from '../modules/shared'
import routes from '../routes'
import { Ok, UnwrapForTest } from '../types'
import makeFakeProject from '../__tests__/fixtures/project'
import makeFakeUser from '../__tests__/fixtures/user'
import makeAddGarantiesFinancieres, { UNAUTHORIZED } from './addGarantiesFinancieres'

const fakePublish = jest.fn((event: StoredEvent) => okAsync<null, InfraNotAvailableError>(null))

const fakeEventBus: EventBus = {
  publish: fakePublish,
  subscribe: jest.fn(),
}

describe('addGarantiesFinancieres use-case', () => {
  describe('when the user has rights on this project', () => {
    const date = Date.now()

    let updatedProject: Project
    const originalProject: Project = UnwrapForTest(
      makeProject(
        makeFakeProject({
          classe: 'Classé',
          notifiedOn: Date.now() - 40 * 24 * 3600 * 1000,
          regionProjet: 'Bretagne / Pays de la Loire',
          departementProjet: 'Loire-Atlantique',
        })
      )
    )

    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

    const drealUser1 = UnwrapForTest(makeUser(makeFakeUser({ role: 'dreal' })))
    const drealUser2 = UnwrapForTest(makeUser(makeFakeUser({ role: 'dreal' })))

    const drealInvitation = UnwrapForTest(
      makeProjectAdmissionKey({
        email: 'drealinvite@test.test',
        dreal: 'Bretagne',
        fullName: 'fullname',
      })
    )

    const sendNotification = jest.fn()

    const fakeFileContents = {
      filename: 'fakeFile.pdf',
      contents: Readable.from('test-content'),
    }

    const fileRepo = {
      save: jest.fn((file: FileObject) => okAsync(null)),
      load: jest.fn(),
    }

    beforeAll(async () => {
      fakePublish.mockClear()
      const shouldUserAccessProject = jest.fn(async () => true)
      const findUsersForDreal = jest.fn(async (region) => {
        if (region === 'Bretagne') return [drealUser1]
        if (region === 'Pays de la Loire') return [drealUser2]
        else throw new Error(`Wrong region provided : ${region}`)
      })
      const findAllProjectAdmissionKeys = jest.fn(async () => [drealInvitation])

      const addGarantiesFinancieres = makeAddGarantiesFinancieres({
        eventBus: fakeEventBus,
        fileRepo: fileRepo as Repository<FileObject>,
        findUsersForDreal,
        findProjectById: async () => originalProject,
        saveProject: async (project: Project) => {
          updatedProject = project
          return Ok(null)
        },
        findAllProjectAdmissionKeys,
        shouldUserAccessProject,
        sendNotification,
      })

      const res = await addGarantiesFinancieres({
        file: fakeFileContents,
        date,
        projectId: originalProject.id,
        user,
      })

      expect(res.is_ok()).toBe(true)
      if (res.is_err()) return

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user,
        projectId: originalProject.id,
      })
    })

    it('should save the attachment with the file service', () => {
      expect(fileRepo.save).toHaveBeenCalled()
      const savedFileContents = fileRepo.save.mock.calls[0][0]
      expect(savedFileContents.contents).toEqual(fakeFileContents.contents)
    })

    it('should update the project garantiesFinancieres* properties', async () => {
      const savedFile = fileRepo.save.mock.calls[0][0]
      expect(savedFile).toBeDefined()

      // Get the latest version of the project
      expect(updatedProject).toBeDefined()

      expect(updatedProject.id).toEqual(originalProject.id)

      expect(updatedProject.garantiesFinancieresSubmittedOn / 100).toBeCloseTo(Date.now() / 100, 0)
      expect(updatedProject.garantiesFinancieresSubmittedBy).toEqual(user.id)
      expect(updatedProject.garantiesFinancieresFileId).toEqual(savedFile.id.toString())
      expect(updatedProject.garantiesFinancieresDate).toEqual(date)

      expect(updatedProject.history).toHaveLength(1)
      if (!updatedProject.history?.length) return
      expect(updatedProject.history[0].before).toEqual({
        garantiesFinancieresSubmittedBy: '',
        garantiesFinancieresSubmittedOn: 0,
        garantiesFinancieresFileId: '',
        garantiesFinancieresDate: 0,
      })
      expect(updatedProject.history[0].after).toEqual({
        garantiesFinancieresSubmittedBy: user.id,
        garantiesFinancieresSubmittedOn: updatedProject.garantiesFinancieresSubmittedOn,
        garantiesFinancieresFileId: savedFile.id.toString(),
        garantiesFinancieresDate: date,
      })
      expect(updatedProject.history[0].createdAt / 100).toBeCloseTo(Date.now() / 100, 0)
      expect(updatedProject.history[0].type).toEqual('garanties-financieres-submission')
      expect(updatedProject.history[0].userId).toEqual(user.id)
    })

    it('should trigger a ProjectGFSubmitted event', async () => {
      expect(fakePublish).toHaveBeenCalled()
      const targetEvent = fakePublish.mock.calls
        .map((call) => call[0])
        .find((event) => event.type === ProjectGFSubmitted.type) as ProjectGFSubmitted

      expect(targetEvent).toBeDefined()
      if (!targetEvent) return

      expect(targetEvent.payload.projectId).toEqual(originalProject.id)

      const fakeFile = fileRepo.save.mock.calls[0][0]

      expect(targetEvent.payload.gfDate).toEqual(new Date(date))
      expect(targetEvent.payload.fileId).toEqual(fakeFile.id.toString())
      expect(targetEvent.payload.submittedBy).toEqual(user.id)
      expect(targetEvent.aggregateId).toEqual(originalProject.id)
    })

    it('should send an email confirmation to the user', async () => {
      expect(sendNotification).toHaveBeenCalledWith({
        type: 'pp-gf-notification',
        message: {
          email: user.email,
          name: user.fullName,
          subject: "Confirmation d'envoi des garanties financières",
        },
        context: {
          projectId: originalProject.id,
          userId: user.id,
        },
        variables: {
          nomProjet: originalProject.nomProjet,
          dreal: originalProject.regionProjet,
          date_depot: moment(date).format('DD/MM/YYYY'),
        },
      })
    })

    it('should send an email notification to dreal users from the projet regions', async () => {
      expect(sendNotification).toHaveBeenCalledWith({
        type: 'dreal-gf-notification',
        message: {
          email: drealUser2.email,
          name: drealUser1.fullName,
          subject:
            'Potentiel - Nouveau dépôt de garantie financière dans votre région, département ' +
            originalProject.departementProjet,
        },
        context: {
          projectId: originalProject.id,
          dreal: 'Bretagne',
          userId: drealUser1.id,
        },
        variables: {
          nomProjet: originalProject.nomProjet,
          departementProjet: originalProject.departementProjet,
          invitation_link: routes.GARANTIES_FINANCIERES_LIST,
        },
      })

      expect(sendNotification).toHaveBeenCalledWith({
        type: 'dreal-gf-notification',
        message: {
          email: drealUser2.email,
          name: drealUser2.fullName,
          subject:
            'Potentiel - Nouveau dépôt de garantie financière dans votre région, département ' +
            originalProject.departementProjet,
        },
        context: {
          projectId: originalProject.id,
          dreal: 'Pays de la Loire',
          userId: drealUser2.id,
        },
        variables: {
          nomProjet: originalProject.nomProjet,
          departementProjet: originalProject.departementProjet,
          invitation_link: routes.GARANTIES_FINANCIERES_LIST,
        },
      })
    })

    it('should send en email notification to invited dreal users from the projet region', async () => {
      expect(sendNotification).toHaveBeenCalledWith({
        type: 'dreal-gf-notification',
        message: {
          email: drealInvitation.email,
          name: drealInvitation.fullName,
          subject:
            'Potentiel - Nouveau dépôt de garantie financière dans votre région, département ' +
            originalProject.departementProjet,
        },
        context: {
          projectId: originalProject.id,
          dreal: 'Bretagne',
        },
        variables: {
          nomProjet: originalProject.nomProjet,
          departementProjet: originalProject.departementProjet,
          invitation_link: routes.DREAL_INVITATION({
            projectAdmissionKey: drealInvitation.id,
          }),
        },
      })
    })
  })

  describe('When the user doesnt have rights on the project', () => {
    it('should return an UNAUTHORIZED error if the user does not have the rights on this project', async () => {
      fakePublish.mockClear()

      const date = Date.now()

      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

      const originalProject = UnwrapForTest(
        makeProject(
          makeFakeProject({
            classe: 'Classé',
            notifiedOn: Date.now() - 40 * 24 * 3600 * 1000,
            regionProjet: 'Bretagne / Pays de la Loire',
            departementProjet: 'Loire-Atlantique',
          })
        )
      )

      const shouldUserAccessProject = jest.fn(async () => false)

      const saveProject = jest.fn()
      const sendNotification = jest.fn()

      const fileRepo = {
        save: jest.fn(),
        load: jest.fn(),
      }

      const addGarantiesFinancieres = makeAddGarantiesFinancieres({
        eventBus: fakeEventBus,
        fileRepo,
        findUsersForDreal: jest.fn(),
        findProjectById: async () => originalProject,
        saveProject,
        findAllProjectAdmissionKeys: jest.fn(),
        shouldUserAccessProject,
        sendNotification,
      })

      const fakeFileContents = {
        filename: 'fakeFile.pdf',
        contents: Readable.from('test-content'),
      }

      const res = await addGarantiesFinancieres({
        file: fakeFileContents,
        date,
        projectId: originalProject.id,
        user,
      })

      expect(res.is_err()).toBe(true)
      if (res.is_ok()) return

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user,
        projectId: originalProject.id,
      })

      expect(fileRepo.save).not.toHaveBeenCalled()
      expect(saveProject).not.toHaveBeenCalled()
      expect(sendNotification).not.toHaveBeenCalled()
      expect(fakePublish).not.toHaveBeenCalled()

      expect(res.unwrap_err()).toEqual(new Error(UNAUTHORIZED))
    })
  })
})
