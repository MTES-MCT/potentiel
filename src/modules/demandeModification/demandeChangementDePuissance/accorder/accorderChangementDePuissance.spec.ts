import {
  ModificationRequest,
  PuissanceVariationWithDecisionJusticeError,
} from '../../../ModificationRequest'
import {
  fakeRepo,
  makeFakeModificationRequest,
  makeFakeProject,
} from '../../../../__tests__/fixtures/aggregates'
import { okAsync } from '@core/utils'
import { FileObject } from '../../../file'
import { Repository } from '@core/domain'
import { Readable } from 'stream'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { makeUser } from '@entities'
import { UnwrapForTest } from '../../../../types'
import { Project } from '../../../project/Project'
import { USER_ROLES } from '@modules/users'
import { makeAccorderChangementDePuissance } from './accorderChangementDePuissance'
import { ModificationRequestAcceptanceParams } from '@modules/modificationRequest'
import { AggregateHasBeenUpdatedSinceError, UnauthorizedError } from '@modules/shared'

describe('Accorder une demande de changement de puissance', () => {
  describe(`Impossible d'accorder un changement de puissance`, () => {
    const fakeFileContents = Readable.from('test-content')
    const fakeFileName = 'myfilename.pdf'
    const fakeModificationRequest = {
      ...makeFakeModificationRequest(),
    }
    const fakeProject = {
      ...makeFakeProject(),
      id: fakeModificationRequest.projectId,
    }
    const modificationRequestRepo = fakeRepo(fakeModificationRequest as ModificationRequest)
    const projectRepo = fakeRepo(fakeProject as Project)

    const fileRepo = {
      save: jest.fn((file: FileObject) => okAsync(null)),
      load: jest.fn(),
    }

    const acceptanceParams: ModificationRequestAcceptanceParams = {
      type: 'puissance',
      newPuissance: 1,
    }

    beforeEach(() => {
      fakeProject.updatePuissance.mockClear()
      projectRepo.save.mockClear()
      fileRepo.save.mockClear()
    })
    describe(`Cas d'un utilisateur n'ayant pas l'autorisation`, () => {
      const rolesNePouvantPasAccorderUnChangementDePuissance = USER_ROLES.filter(
        (role) => !['admin', 'dgec-validateur', 'dreal'].includes(role)
      )
      for (const role of rolesNePouvantPasAccorderUnChangementDePuissance) {
        it(`
        Étant donné un utilisateur avec le rôle ${role}
        Lorsqu'il accorde une demande de changement de puissance alors que son rôle ne le permet pas
        Alors il devrait-être informé qu'il n'a pas les droits nécessaire pour réaliser cette action
        `, async () => {
          const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role })))
          const accorderChangementDePuissance = makeAccorderChangementDePuissance({
            modificationRequestRepo,
            projectRepo,
            fileRepo: fileRepo as Repository<FileObject>,
          })

          const résultat = await accorderChangementDePuissance({
            modificationRequestId: fakeModificationRequest.id,
            versionDate: fakeModificationRequest.lastUpdatedOn,
            acceptanceParams,
            responseFile: { contents: fakeFileContents, filename: fakeFileName },
            utilisateur: fakeUser,
          })

          expect(résultat.isErr()).toEqual(true)
          if (résultat.isErr()) {
            expect(résultat._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
          }
        })
      }
    })

    describe(`Cas d'une date de modification différente de la date de la demande`, () => {
      it(`
      Étant donné un utilisateur avec un rôle autorisé
      Lorsqu'il accorde une demande de changement de puissance mais que la date de modification est différente de la date de demande 
      Alors l'utilisateur devrait être alerté que l'action est impossible car il y a eu une mise à jour entre temps`, async () => {
        const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))
        const accorderChangementDePuissance = makeAccorderChangementDePuissance({
          modificationRequestRepo,
          projectRepo,
          fileRepo: fileRepo as Repository<FileObject>,
        })

        const résultat = await accorderChangementDePuissance({
          modificationRequestId: fakeModificationRequest.id,
          versionDate: new Date(1),
          acceptanceParams,
          responseFile: { contents: fakeFileContents, filename: fakeFileName },
          utilisateur: fakeUser,
        })

        expect(résultat.isErr()).toEqual(true)
        if (résultat.isErr()) {
          expect(résultat.error).toBeInstanceOf(AggregateHasBeenUpdatedSinceError)
        }
      })
    })

    describe(`Cas d'une décision de justice`, () => {
      it(`
      Étant donné un utilisateur avec un rôle autorisé
      Lorsqu'il accorde une demande de changement de puissance mais que celle-ci fait suite à une décision de justice et que l'augmentation est supérieure au seuil toléré (10%)
      Alors l'utilisateur devrait être informé que l'augmentation de la puissance est impossible`, async () => {
        const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))
        const accorderChangementDePuissance = makeAccorderChangementDePuissance({
          modificationRequestRepo,
          projectRepo,
          fileRepo: fileRepo as Repository<FileObject>,
        })

        const résultat = await accorderChangementDePuissance({
          modificationRequestId: fakeModificationRequest.id,
          versionDate: fakeModificationRequest.lastUpdatedOn,
          acceptanceParams: { ...acceptanceParams, isDecisionJustice: true },
          utilisateur: fakeUser,
        })

        expect(résultat.isErr()).toEqual(true)
        if (résultat.isErr()) {
          expect(résultat.error).toBeInstanceOf(PuissanceVariationWithDecisionJusticeError)
        }
      })
    })
  })

  describe(`Possible d'accorder un changement de puissance`, () => {
    const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))
    const fakeModificationRequest = {
      ...makeFakeModificationRequest(),
      type: 'puissance',
    }

    const fakeProject = {
      ...makeFakeProject(),
      id: fakeModificationRequest.projectId,
      puissanceInitiale: 10,
      puissance: 10,
    }

    const modificationRequestRepo = fakeRepo(fakeModificationRequest as ModificationRequest)
    const projectRepo = fakeRepo(fakeProject as Project)
    const fileRepo = {
      save: jest.fn((file: FileObject) => okAsync(null)),
      load: jest.fn(),
    }

    const fakeFileContents = Readable.from('test-content')
    const fakeFileName = 'myfilename.pdf'

    beforeEach(() => {
      fakeProject.updatePuissance.mockClear()
      projectRepo.save.mockClear()
      fileRepo.save.mockClear()
    })

    describe(`Cas d'une décision de justice`, () => {
      it(`
      Étant donné un utilisateur avec un rôle autorisé
      Lorsqu'il accorde une demande de changement de puissance et que celle-ci fait suite à une décision de justice et que l'augmentation est inférieure ou égale au seuil toléré (10%)
      Alors l'utilisateur devrait être informé que le changement de la puissance a bien été accepté
        `, async () => {
        const acceptanceParams: ModificationRequestAcceptanceParams = {
          type: 'puissance',
          newPuissance: 1,
          isDecisionJustice: true,
        }

        const accorderChangementDePuissance = makeAccorderChangementDePuissance({
          modificationRequestRepo,
          projectRepo,
          fileRepo: fileRepo as Repository<FileObject>,
        })

        const résultat = await accorderChangementDePuissance({
          modificationRequestId: fakeModificationRequest.id,
          versionDate: fakeModificationRequest.lastUpdatedOn,
          acceptanceParams,
          utilisateur: fakeUser,
        })

        expect(résultat.isOk()).toEqual(true)
        if (résultat.isOk()) {
          expect(projectRepo.save).toHaveBeenCalled()
          expect(projectRepo.save.mock.calls[0][0]).toEqual(fakeProject)
        }
      })
    })

    describe(`Cas générique`, () => {
      it(`
      Étant donné un utilisateur avec un rôle autorisé
      Lorsqu'il accorde une demande de changement en ayant
      Alors l'utilisateur devrait être informé que le changement de la puissance a bien été acceptée
      `, async () => {
        const acceptanceParams: ModificationRequestAcceptanceParams = {
          type: 'puissance',
          newPuissance: 11,
        }

        const accorderChangementDePuissance = makeAccorderChangementDePuissance({
          modificationRequestRepo,
          projectRepo,
          fileRepo: fileRepo as Repository<FileObject>,
        })

        const résultat = await accorderChangementDePuissance({
          modificationRequestId: fakeModificationRequest.id,
          versionDate: fakeModificationRequest.lastUpdatedOn,
          acceptanceParams,
          responseFile: { contents: fakeFileContents, filename: fakeFileName },
          utilisateur: fakeUser,
        })

        expect(résultat.isOk()).toEqual(true)
        if (résultat.isOk()) {
          expect(projectRepo.save).toHaveBeenCalled()
          expect(projectRepo.save.mock.calls[0][0]).toEqual(fakeProject)

          expect(fakeProject.updatePuissance).toHaveBeenCalledTimes(1)
          expect(fakeProject.updatePuissance).toHaveBeenCalledWith(fakeUser, 11)

          expect(fileRepo.save).toHaveBeenCalledTimes(1)
        }
      })
    })
  })
})
