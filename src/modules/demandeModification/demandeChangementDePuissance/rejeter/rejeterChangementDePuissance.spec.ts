import { Readable } from 'stream'
import { Repository } from '@core/domain'
import { okAsync } from '@core/utils'
import { makeUser } from '@entities'
import { UnwrapForTest } from '../../../../types'
import { fakeRepo, makeFakeModificationRequest } from '../../../../__tests__/fixtures/aggregates'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { FileObject } from '@modules/file'
import { UnauthorizedError } from '@modules/shared'
import { ModificationRequest } from '@modules/modificationRequest'
import { makeRejeterChangementDePuissance } from './rejeterChangementDePuissance'
import { USER_ROLES } from '@modules/users'

describe(`Rejeter une demande de changement de puissance`, () => {
  const fakeModificationRequest = {
    ...makeFakeModificationRequest(),
  }
  const modificationRequestRepo = fakeRepo(fakeModificationRequest as ModificationRequest)
  const fileRepo = {
    save: jest.fn((file: FileObject) => okAsync(null)),
    load: jest.fn(),
  } as Repository<FileObject>

  const fakeFileContents = Readable.from('test-content')
  const fakeFileName = 'myfilename.pdf'

  describe(`Impossible de rejeter un changement de puissance`, () => {
    describe(`Cas d'un utilisateur n'ayant pas l'autorisation`, () => {})
    const rolesNePouvantPasRejeterUnChangementDePuissance = USER_ROLES.filter(
      (role) => !['admin', 'dgec-validateur', 'dreal'].includes(role)
    )

    for (const role of rolesNePouvantPasRejeterUnChangementDePuissance) {
      it(`
        Étant donné un utilisateur avec le rôle ${role}
        Lorsqu'il rejete une demande de changement de puissance alors que son rôle ne le permet pas
        Alors il devrait-être informé qu'il n'a pas les droits nécessaire pour réaliser cette action
        `, async () => {
        const utilisateur = UnwrapForTest(makeUser(makeFakeUser({ role })))
        const rejeterChangementDePuissance = makeRejeterChangementDePuissance({
          modificationRequestRepo,
          fileRepo,
        })

        const résultat = await rejeterChangementDePuissance({
          demandeId: fakeModificationRequest.id,
          versionDate: fakeModificationRequest.lastUpdatedOn,
          fichierRéponse: { contents: fakeFileContents, filename: fakeFileName },
          utilisateur,
        })

        expect(résultat.isErr()).toEqual(true)
        if (résultat.isErr()) {
          expect(résultat._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
        }
      })
    }
  })
})

// describe('rejectModificationRequest use-case', () => {
//   const fakeFileContents = Readable.from('test-content')
//   const fakeFileName = 'myfilename.pdf'
//   const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))

//   const rejectModificationRequest = makeRejectModificationRequest({
//     modificationRequestRepo,
//     fileRepo: fileRepo as Repository<FileObject>,
//   })

//   describe('when user is admin', () => {
//     const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))

//     describe('when a response file is attached', () => {
//       beforeAll(async () => {
//         const res = await rejectModificationRequest({
//           modificationRequestId: fakeModificationRequest.id,
//           versionDate: fakeModificationRequest.lastUpdatedOn,
//           responseFile: { contents: fakeFileContents, filename: fakeFileName },
//           rejectedBy: fakeUser,
//         })

//         if (res.isErr()) logger.error(res.error)
//         expect(res.isOk()).toEqual(true)
//       })

//       it('should save the response file', () => {
//         expect(fileRepo.save).toHaveBeenCalled()
//         expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents)
//       })

//       it('should call reject on modificationRequest', () => {
//         const responseFileId = fileRepo.save.mock.calls[0][0].id
//         expect(fakeModificationRequest.reject).toHaveBeenCalledTimes(1)
//         expect(fakeModificationRequest.reject).toHaveBeenCalledWith(
//           fakeUser,
//           responseFileId.toString()
//         )
//       })

//       it('should save the modificationRequest', () => {
//         expect(modificationRequestRepo.save).toHaveBeenCalled()
//         expect(modificationRequestRepo.save.mock.calls[0][0]).toEqual(fakeModificationRequest)
//       })
//     })
//   })

//   describe('when user is not admin', () => {
//     const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

//     it('should return UnauthorizedError', async () => {
//       const res = await rejectModificationRequest({
//         modificationRequestId: fakeModificationRequest.id,
//         versionDate: fakeModificationRequest.lastUpdatedOn,
//         responseFile: { contents: fakeFileContents, filename: fakeFileName },
//         rejectedBy: fakeUser,
//       })

//       expect(res.isErr()).toEqual(true)
//       if (res.isOk()) return

//       expect(res.error).toBeInstanceOf(UnauthorizedError)
//     })
//   })

//   describe('when versionDate is different than current versionDate', () => {
//     it('should return AggregateHasBeenUpdatedSinceError', async () => {
//       const res = await rejectModificationRequest({
//         modificationRequestId: fakeModificationRequest.id,
//         versionDate: new Date(1),
//         responseFile: { contents: fakeFileContents, filename: fakeFileName },
//         rejectedBy: fakeUser,
//       })

//       expect(res.isErr()).toEqual(true)
//       if (res.isOk()) return
//       expect(res.error).toBeInstanceOf(AggregateHasBeenUpdatedSinceError)
//     })
//   })
// })
