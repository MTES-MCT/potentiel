import makeFakeUser from '../../../../__tests__/fixtures/user'
import { makeUser } from '@entities'
import { UnwrapForTest } from '../../../../types'
import { USER_ROLES } from '@modules/users'
import { makeAccorderChangementDePuissance } from './accorderChangementDePuissance'
import { AggregateHasBeenUpdatedSinceError, UnauthorizedError } from '@modules/shared'
import {
  fakeRepo,
  fakeTransactionalRepo,
  makeFakeModificationRequest,
} from '../../../../__tests__/fixtures/aggregates'
import { ModificationRequest } from '@modules/modificationRequest'

describe('Accorder une demande de changement de puissance', () => {
  const utilisateur = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))
  const demandeChangementDePuissance = {
    ...makeFakeModificationRequest(),
    lastUpdatedOn: new Date('2023-01-01'),
    type: 'puissance',
  } as ModificationRequest
  const modificationRequestRepo = {
    ...fakeRepo(demandeChangementDePuissance),
    ...fakeTransactionalRepo(demandeChangementDePuissance),
  }

  // const fakeProject = {
  //   ...makeFakeProject(),
  //   id: fakeModificationRequest.projectId,
  //   puissanceInitiale: 10,
  //   puissance: 10,
  // }
  // const projectRepo = fakeTransactionalRepo(fakeProject as Project)
  // const fileRepo = {
  //   save: jest.fn((file: FileObject) => okAsync(null)),
  //   load: jest.fn(),
  // }

  // const paramètres: ModificationRequestAcceptanceParams = {
  //   type: 'puissance',
  //   newPuissance: 1,
  // }

  // const fakeFileContents = Readable.from('test-content')
  // const fakeFileName = 'myfilename.pdf'

  // const fichierRéponse = { contents: fakeFileContents, filename: fakeFileName }

  // beforeEach(() => {
  //   fakeProject.updatePuissance.mockClear()
  //   fileRepo.save.mockClear()
  // })

  describe(`Impossible d'accorder un changement de puissance si l'utilisateur n'a pas l'autorisation`, () => {
    const rolesNePouvantPasAccorderUnChangementDePuissance = USER_ROLES.filter(
      (role) => !['admin', 'dgec-validateur', 'dreal'].includes(role)
    )
    for (const role of rolesNePouvantPasAccorderUnChangementDePuissance) {
      it(`
        Étant donné un utilisateur avec le rôle ${role}
        Lorsqu'il accorde une demande de changement de puissance alors que son rôle ne le permet pas
        Alors il devrait-être informé qu'il n'a pas les droits nécessaire pour réaliser cette action
        `, async () => {
        const utilisateur = UnwrapForTest(makeUser(makeFakeUser({ role })))
        const accorderChangementDePuissance = makeAccorderChangementDePuissance({
          modificationRequestRepo,
        })

        const résultat = await accorderChangementDePuissance({
          demandeId: demandeChangementDePuissance.id,
          versionDate: new Date('2023-01-01'),
          utilisateur,
        })

        expect(résultat.isErr()).toEqual(true)
        if (résultat.isErr()) {
          expect(résultat._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
        }
      })
    }
  })

  describe(`Impossible d'accorder un changement de puissance si la date de modification est différente de la date de la demande`, () => {
    it(`
     Étant donné un utilisateur avec un rôle autorisé
     Lorsqu'il accorde une demande de changement de puissance mais que la date de modification est différente de la date de demande
     Alors l'utilisateur devrait être alerté que l'action est impossible car il y a eu une mise à jour entre temps    
    `, async () => {
      const accorderChangementDePuissance = makeAccorderChangementDePuissance({
        modificationRequestRepo,
      })

      const résultat = await accorderChangementDePuissance({
        demandeId: demandeChangementDePuissance.id,
        versionDate: new Date('2023-01-02'),
        utilisateur,
      })

      expect(résultat.isErr()).toEqual(true)
      if (résultat.isErr()) {
        expect(résultat.error).toBeInstanceOf(AggregateHasBeenUpdatedSinceError)
      }
    })
  })

  // describe(`Cas d'une réponse qui n'est pas une décision de justice et qui n'a pas de fichier de réponse`, () => {
  //   it(`
  //   Étant donné un utilisateur avec un rôle autorisé
  //   Lorsqu'il accorde une demande de changement de puissance à une demande qui ne fait pas suite à une décisision de justice, et qui n'a pas de fichier de réponse fourni
  //   Alors l'utilisateur devrait être alerté que l'action est impossible car le fichier est obligatoire
  //   `, async () => {
  //     const accorderChangementDePuissance = makeAccorderChangementDePuissance({
  //       modificationRequestRepo,
  //       projectRepo,
  //       fileRepo,
  //     })

  //     const résultat = await accorderChangementDePuissance({
  //       demandeId: fakeModificationRequest.id,
  //       versionDate: new Date(1),
  //       paramètres,
  //       utilisateur,
  //     })

  //     expect(résultat.isErr()).toEqual(true)
  //     if (résultat.isErr()) {
  //       expect(résultat.error).toBeInstanceOf(FichierDeRéponseObligatoireError)
  //     }
  //   })
  // })

  // describe(`Cas d'une date de modification différente de la date de la demande`, () => {
  //   it(`
  //   Étant donné un utilisateur avec un rôle autorisé
  //   Lorsqu'il accorde une demande de changement de puissance mais que la date de modification est différente de la date de demande
  //   Alors l'utilisateur devrait être alerté que l'action est impossible car il y a eu une mise à jour entre temps`, async () => {
  //     const accorderChangementDePuissance = makeAccorderChangementDePuissance({
  //       modificationRequestRepo,
  //       projectRepo,
  //       fileRepo,
  //     })

  //     const résultat = await accorderChangementDePuissance({
  //       demandeId: fakeModificationRequest.id,
  //       versionDate: new Date(1),
  //       paramètres,
  //       utilisateur,
  //       fichierRéponse,
  //     })

  //     expect(résultat.isErr()).toEqual(true)
  //     if (résultat.isErr()) {
  //       expect(résultat.error).toBeInstanceOf(AggregateHasBeenUpdatedSinceError)
  //     }
  //   })
  // })

  // describe(`Cas d'une décision de justice`, () => {
  //   it(`
  //   Étant donné un utilisateur avec un rôle autorisé
  //   Lorsqu'il accorde une demande de changement de puissance mais que celle-ci fait suite à une décision de justice et que l'augmentation est supérieure au seuil toléré (10%)
  //   Alors l'utilisateur devrait être informé que l'augmentation de la puissance est impossible`, async () => {
  //     const accorderChangementDePuissance = makeAccorderChangementDePuissance({
  //       modificationRequestRepo,
  //       projectRepo,
  //       fileRepo,
  //     })

  //     const résultat = await accorderChangementDePuissance({
  //       demandeId: fakeModificationRequest.id,
  //       versionDate: fakeModificationRequest.lastUpdatedOn,
  //       paramètres: { ...paramètres, newPuissance: 100, isDecisionJustice: true },
  //       utilisateur,
  //       fichierRéponse,
  //     })

  //     expect(résultat.isErr()).toEqual(true)
  //     if (résultat.isErr()) {
  //       expect(résultat.error).toBeInstanceOf(PuissanceVariationWithDecisionJusticeError)
  //     }
  //   })
  // })

  // describe(`Possible d'accorder un changement de puissance`, () => {
  //   describe(`Cas d'une décision de justice`, () => {
  //     it(`
  //     Étant donné un utilisateur avec un rôle autorisé
  //     Lorsqu'il accorde une demande de changement de puissance et que celle-ci fait suite à une décision de justice et que l'augmentation est inférieure ou égale au seuil toléré (10%)
  //     Alors l'utilisateur devrait être informé que le changement de la puissance a bien été accepté
  //       `, async () => {
  //       const paramètres: ModificationRequestAcceptanceParams = {
  //         type: 'puissance',
  //         newPuissance: 1,
  //         isDecisionJustice: true,
  //       }

  //       const accorderChangementDePuissance = makeAccorderChangementDePuissance({
  //         modificationRequestRepo,
  //         projectRepo,
  //         fileRepo,
  //       })

  //       const résultat = await accorderChangementDePuissance({
  //         demandeId: fakeModificationRequest.id,
  //         versionDate: fakeModificationRequest.lastUpdatedOn,
  //         paramètres: paramètres,
  //         utilisateur,
  //       })

  //       expect(résultat.isOk()).toEqual(true)
  //       if (résultat.isOk()) {
  //         expect(projectRepo.save).toHaveBeenCalled()
  //         expect(projectRepo.save.mock.calls[0][0]).toEqual(fakeProject)
  //       }
  //     })
  //   })

  //   describe(`Cas générique`, () => {
  //     it(`
  //     Étant donné un utilisateur avec un rôle autorisé
  //     Lorsqu'il accorde une demande de changement en ayant
  //     Alors l'utilisateur devrait être informé que le changement de la puissance a bien été acceptée
  //     `, async () => {
  //       const accorderChangementDePuissance = makeAccorderChangementDePuissance({
  //         modificationRequestRepo,
  //         projectRepo,
  //         fileRepo: fileRepo as Repository<FileObject>,
  //       })

  //       const résultat = await accorderChangementDePuissance({
  //         demandeId: fakeModificationRequest.id,
  //         versionDate: fakeModificationRequest.lastUpdatedOn,
  //         paramètres,
  //         fichierRéponse,
  //         utilisateur,
  //       })

  //       expect(résultat.isOk()).toEqual(true)
  //       if (résultat.isOk()) {
  //         expect(projectRepo.save).toHaveBeenCalled()
  //         expect(projectRepo.save.mock.calls[0][0]).toEqual(fakeProject)

  //         expect(fakeProject.updatePuissance).toHaveBeenCalledTimes(1)
  //         expect(fakeProject.updatePuissance).toHaveBeenCalledWith(utilisateur, 1)

  //         expect(fileRepo.save).toHaveBeenCalledTimes(1)
  //       }
  //     })
  //   })
  // })
})
