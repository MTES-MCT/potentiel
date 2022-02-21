import { Readable } from 'stream'
import { ModificationRequested } from '@modules/modificationRequest'
import { NumeroGestionnaireSubmitted } from '@modules/project'
import { DomainEvent, Repository } from '@core/domain'
import { okAsync } from '@core/utils'
import { FileObject } from '@modules/file'
import { EntityNotFoundError, InfraNotAvailableError } from '@modules/shared'
import makeFakeUser from '../__tests__/fixtures/user'
import makeRequestModification, { ACCESS_DENIED_ERROR } from './requestModification'
import { appelOffreRepo } from '@dataAccess/inMemory'

const fakeFileContents = {
  filename: 'fakeFile.pdf',
  contents: Readable.from('test-content'),
}

describe('requestModification use-case', () => {
  const getProjectAppelOffreId = jest.fn((projectId) =>
    okAsync<string, EntityNotFoundError | InfraNotAvailableError>('appelOffreId')
  )

  describe('given user has no rights on this project', () => {
    const shouldUserAccessProject = jest.fn(async () => false)

    const fileRepo = {
      save: jest.fn(),
      load: jest.fn(),
    }

    const eventBus = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    }

    const requestModification = makeRequestModification({
      fileRepo,
      appelOffreRepo,
      eventBus,
      shouldUserAccessProject,
      getProjectAppelOffreId,
    })

    it('should return ACCESS_DENIED_ERROR', async () => {
      const user = makeFakeUser({ role: 'porteur-projet' })
      const requestResult = await requestModification({
        type: 'delai' as 'delai',
        justification: 'justification',
        delayInMonths: 12,
        file: fakeFileContents,
        user,
        projectId: 'project1',
      })

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user,
        projectId: 'project1',
      })

      expect(fileRepo.save).not.toHaveBeenCalled()
      expect(requestResult.is_err()).toEqual(true)
      expect(requestResult.unwrap_err().message).toEqual(ACCESS_DENIED_ERROR)
    })
  })

  describe('given user is not a porteur-projet', () => {
    const shouldUserAccessProject = jest.fn()

    const fileRepo = {
      save: jest.fn(),
      load: jest.fn(),
    }

    const eventBus = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    }

    const requestModification = makeRequestModification({
      fileRepo,
      appelOffreRepo,
      eventBus,
      shouldUserAccessProject,
      getProjectAppelOffreId,
    })

    it('should return ACCESS_DENIED_ERROR', async () => {
      const user = makeFakeUser({ role: 'admin' })
      const requestResult = await requestModification({
        type: 'delai' as 'delai',
        justification: 'justification',
        delayInMonths: 12,
        file: fakeFileContents,
        user,
        projectId: 'project1',
      })

      expect(shouldUserAccessProject).not.toHaveBeenCalled()
      expect(fileRepo.save).not.toHaveBeenCalled()
      expect(requestResult.is_err()).toEqual(true)
      expect(requestResult.unwrap_err().message).toEqual(ACCESS_DENIED_ERROR)
    })
  })

  describe('given user is the projects porteur-project', () => {
    const user = makeFakeUser({ id: '1234', role: 'porteur-projet' })
    const shouldUserAccessProject = jest.fn(async () => true)

    describe('given request is actionnaire', () => {
      const fileRepo = {
        save: jest.fn((file: FileObject) => okAsync(null)),
        load: jest.fn(),
      }

      const eventBus = {
        publish: jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null)),
        subscribe: jest.fn(),
      }

      const requestModification = makeRequestModification({
        fileRepo: fileRepo as Repository<FileObject>,
        appelOffreRepo,
        eventBus,
        shouldUserAccessProject,
        getProjectAppelOffreId,
      })

      beforeAll(async () => {
        const requestResult = await requestModification({
          type: 'delai' as 'delai',
          justification: 'justification',
          delayInMonths: 12,
          file: fakeFileContents,
          user,
          projectId: 'project1',
        })

        expect(requestResult.is_ok()).toEqual(true)
      })

      it('should save the file attachment', () => {
        // Make sure the file has been saved
        expect(fileRepo.save).toHaveBeenCalled()
        expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents.contents)
        const fakeFile = fileRepo.save.mock.calls[0][0]
        expect(fakeFile).toBeDefined()
      })

      it('should emit ModificationRequested', () => {
        const fakeFile = fileRepo.save.mock.calls[0][0]
        expect(eventBus.publish).toHaveBeenCalledTimes(1)
        expect(eventBus.publish.mock.calls[0][0].payload).toEqual(
          expect.objectContaining({
            type: 'delai',
            delayInMonths: 12,
            justification: 'justification',
            fileId: fakeFile.id.toString(),
            requestedBy: user.id,
            projectId: 'project1',
          })
        )
      })
    })

    describe('given request is delai with numeroGestionnaire given', () => {
      const fileRepo = {
        save: jest.fn((file: FileObject) => okAsync(null)),
        load: jest.fn(),
      }

      const eventBus = {
        publish: jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null)),
        subscribe: jest.fn(),
      }

      const requestModification = makeRequestModification({
        fileRepo: fileRepo as Repository<FileObject>,
        appelOffreRepo,
        eventBus,
        shouldUserAccessProject,
        getProjectAppelOffreId,
      })

      beforeAll(async () => {
        const requestResult = await requestModification({
          type: 'delai' as 'delai',
          justification: 'justification',
          delayInMonths: 12,
          numeroGestionnaire: 'numero gestionnaire',
          file: fakeFileContents,
          user,
          projectId: 'project1',
        })

        expect(requestResult.is_ok()).toEqual(true)
      })

      it('should save the file attachment', () => {
        // Make sure the file has been saved
        expect(fileRepo.save).toHaveBeenCalled()
        expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents.contents)
        const fakeFile = fileRepo.save.mock.calls[0][0]
        expect(fakeFile).toBeDefined()
      })

      it('should emit ModificationRequested', () => {
        const fakeFile = fileRepo.save.mock.calls[0][0]
        const firstEvent = eventBus.publish.mock.calls[0][0]
        expect(firstEvent).toBeInstanceOf(ModificationRequested)
        expect(firstEvent.payload).toMatchObject({
          type: 'delai',
          delayInMonths: 12,
          justification: 'justification',
          fileId: fakeFile.id.toString(),
          requestedBy: user.id,
          projectId: 'project1',
        })
      })

      it('should emit NumeroGestionnaireSubmitted', () => {
        const secondEvent = eventBus.publish.mock.calls[1][0]
        expect(secondEvent).toBeInstanceOf(NumeroGestionnaireSubmitted)
        expect(secondEvent.payload).toMatchObject({
          numeroGestionnaire: 'numero gestionnaire',
          submittedBy: user.id,
          projectId: 'project1',
        })
      })
    })
  })
})
