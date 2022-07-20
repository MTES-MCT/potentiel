import { Readable } from 'stream'
import { Repository } from '@core/domain'
import { logger, okAsync } from '@core/utils'
import { makeUser } from '@entities'
import { UnwrapForTest } from '../../../types'
import {
  fakeRepo,
  makeFakeModificationRequest,
  makeFakeProject,
} from '../../../__tests__/fixtures/aggregates'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { FileObject } from '../../file'
import { AggregateHasBeenUpdatedSinceError, UnauthorizedError } from '../../shared'
import { ModificationRequest } from '../ModificationRequest'
import { makeRejectModificationRequest } from './rejectModificationRequest'

import { UserRole } from '@modules/users'

describe('rejectModificationRequest use-case', () => {
  const fakeModificationRequest = {
    ...makeFakeModificationRequest(),
  }

  const modificationRequestRepo = fakeRepo(fakeModificationRequest as ModificationRequest)
  const fileRepo = {
    save: jest.fn((file: FileObject) => okAsync(null)),
    load: jest.fn(),
  }
  const fakeFileContents = Readable.from('test-content')
  const fakeFileName = 'myfilename.pdf'
  const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))

  const rejectModificationRequest = makeRejectModificationRequest({
    modificationRequestRepo,
    fileRepo: fileRepo as Repository<FileObject>,
  })

  describe(`Impossible d'accepter une demande de modification de type 'abandon' si non Admin/DGEC`, () => {
    describe(`Etant donné un utilisateur autre que Admin, DGEC`, () => {
      const rolesNePouvantPasRefuserDemandeModificationTypeAbandon: UserRole[] = [
        'acheteur-obligé',
        'dreal',
        'ademe',
        'porteur-projet',
      ]

      const fakeModificationRequest = {
        ...makeFakeModificationRequest(),
        type: 'abandon',
      }
      const modificationRequestRepo = fakeRepo(fakeModificationRequest as ModificationRequest)

      const rejectModificationRequest = makeRejectModificationRequest({
        modificationRequestRepo,
        fileRepo: fileRepo as Repository<FileObject>,
      })

      for (const role of rolesNePouvantPasRefuserDemandeModificationTypeAbandon) {
        const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role })))

        it(`
        Lorsqu'un utilisateur de type "${role}" rejete une demande de modification de type 'abandon'
        Alors une erreur de type 'UnauthorizedError' devrait être retournée
        'modificationRequestRepo' ne devrait pas sauvegardé la modification de type 'abandon'
        'fileRepo' ne devraient etre appelé ni sauvegardé le fichier de justification
        `, async () => {
          const res = await rejectModificationRequest({
            modificationRequestId: fakeModificationRequest.id,
            versionDate: fakeModificationRequest.lastUpdatedOn,
            responseFile: { contents: fakeFileContents, filename: fakeFileName },
            rejectedBy: fakeUser,
          })

          expect(res.isErr()).toBe(true)
          expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
          expect(fileRepo.load).not.toHaveBeenCalled()
          expect(fileRepo.save).not.toHaveBeenCalled()
          expect(modificationRequestRepo.save).not.toHaveBeenCalled()
        })
      }
    })
  })

  describe('when user is admin', () => {
    const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))

    describe('when a response file is attached', () => {
      beforeAll(async () => {
        const res = await rejectModificationRequest({
          modificationRequestId: fakeModificationRequest.id,
          versionDate: fakeModificationRequest.lastUpdatedOn,
          responseFile: { contents: fakeFileContents, filename: fakeFileName },
          rejectedBy: fakeUser,
        })

        if (res.isErr()) logger.error(res.error)
        expect(res.isOk()).toEqual(true)
      })

      it('should save the response file', () => {
        expect(fileRepo.save).toHaveBeenCalled()
        expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents)
      })

      it('should call reject on modificationRequest', () => {
        const responseFileId = fileRepo.save.mock.calls[0][0].id
        expect(fakeModificationRequest.reject).toHaveBeenCalledTimes(1)
        expect(fakeModificationRequest.reject).toHaveBeenCalledWith(
          fakeUser,
          responseFileId.toString()
        )
      })

      it('should save the modificationRequest', () => {
        expect(modificationRequestRepo.save).toHaveBeenCalled()
        expect(modificationRequestRepo.save.mock.calls[0][0]).toEqual(fakeModificationRequest)
      })
    })
  })

  describe('when user is not admin', () => {
    const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

    it('should return UnauthorizedError', async () => {
      const res = await rejectModificationRequest({
        modificationRequestId: fakeModificationRequest.id,
        versionDate: fakeModificationRequest.lastUpdatedOn,
        responseFile: { contents: fakeFileContents, filename: fakeFileName },
        rejectedBy: fakeUser,
      })

      expect(res.isErr()).toEqual(true)
      if (res.isOk()) return

      expect(res.error).toBeInstanceOf(UnauthorizedError)
    })
  })

  describe('when versionDate is different than current versionDate', () => {
    it('should return AggregateHasBeenUpdatedSinceError', async () => {
      const res = await rejectModificationRequest({
        modificationRequestId: fakeModificationRequest.id,
        versionDate: new Date(1),
        responseFile: { contents: fakeFileContents, filename: fakeFileName },
        rejectedBy: fakeUser,
      })

      expect(res.isErr()).toEqual(true)
      if (res.isOk()) return
      expect(res.error).toBeInstanceOf(AggregateHasBeenUpdatedSinceError)
    })
  })
})
