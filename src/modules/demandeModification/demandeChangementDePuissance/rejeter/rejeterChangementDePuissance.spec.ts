import { Readable } from 'stream'
import { okAsync } from '@core/utils'
import { makeUser } from '@entities'
import { UnwrapForTest } from '../../../../types'
import { fakeRepo, makeFakeModificationRequest } from '../../../../__tests__/fixtures/aggregates'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { FileObject } from '@modules/file'
import { AggregateHasBeenUpdatedSinceError, UnauthorizedError } from '@modules/shared'
import { makeRejeterChangementDePuissance } from './rejeterChangementDePuissance'
import { USER_ROLES } from '@modules/users'
import { ModificationRequest } from '@modules/modificationRequest'

describe(`Rejeter une demande de changement de puissance`, () => {
  const demandeChangementDePuissance = {
    ...makeFakeModificationRequest(),
    lastUpdatedOn: new Date('2023-01-01'),
    type: 'puissance',
  } as ModificationRequest

  const modificationRequestRepo = fakeRepo(demandeChangementDePuissance)
  const fileRepo = {
    save: jest.fn((file: FileObject) => okAsync(null)),
    load: jest.fn(),
  }

  const fakeFileContents = Readable.from('test-content')
  const fakeFileName = 'myfilename.pdf'

  const utilisateur = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))

  describe(`Impossible de rejeter un changement de puissance si l'utilisateur n'a pas l'autorisation`, () => {
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
          demandeId: demandeChangementDePuissance.id,
          versionDate: new Date('2023-01-01'),
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

  describe(`Impossible de rejeter un changement de puissance si la date de modification est différente de la date de la demande`, () => {
    it(`
      Étant donné un utilisateur avec un rôle autorisé
      Lorsqu'il rejette une demande de changement de puissance mais que la date de modification est différente de la date de demande 
      Alors l'utilisateur devrait être alerté que l'action est impossible car il y a eu une mise à jour entre temps`, async () => {
      const rejeterChangementDePuissance = makeRejeterChangementDePuissance({
        modificationRequestRepo,
        fileRepo,
      })

      const résultat = await rejeterChangementDePuissance({
        demandeId: demandeChangementDePuissance.id,
        versionDate: new Date(1),
        fichierRéponse: { contents: fakeFileContents, filename: fakeFileName },
        utilisateur,
      })

      expect(résultat.isErr()).toEqual(true)
      if (résultat.isErr()) {
        expect(résultat.error).toBeInstanceOf(AggregateHasBeenUpdatedSinceError)
      }
    })
  })

  describe(`Possible de rejeter un changement de puissance`, () => {
    it(`
    Étant donné un utilisateur avec un rôle autorisé
    Lorsqu'il rejette une demande de changement de puissance en ayant fourni un courrier de réponse
    Alors l'utilisateur devrait être alerté que la demande de changement de puissance a bien été rejetée`, async () => {
      const rejeterChangementDePuissance = makeRejeterChangementDePuissance({
        modificationRequestRepo,
        fileRepo,
      })

      const résultat = await rejeterChangementDePuissance({
        demandeId: demandeChangementDePuissance.id,
        versionDate: new Date('2023-01-01'),
        fichierRéponse: { contents: fakeFileContents, filename: fakeFileName },
        utilisateur,
      })

      expect(résultat.isOk()).toEqual(true)
      if (résultat.isOk()) {
        const fichierRéponseId = fileRepo.save.mock.calls[0][0].id

        expect(fileRepo.save).toHaveBeenCalledTimes(1)
        expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents)
        expect(demandeChangementDePuissance.reject).toHaveBeenCalledTimes(1)
        expect(demandeChangementDePuissance.reject).toHaveBeenCalledWith(
          utilisateur,
          fichierRéponseId.toString()
        )
      }
    })
  })
})
