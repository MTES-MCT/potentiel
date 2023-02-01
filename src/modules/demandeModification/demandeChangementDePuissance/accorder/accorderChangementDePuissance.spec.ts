import makeFakeUser from '../../../../__tests__/fixtures/user'
import { makeUser } from '@entities'
import { UnwrapForTest } from '../../../../types'
import { USER_ROLES } from '@modules/users'
import { makeAccorderChangementDePuissance } from './accorderChangementDePuissance'
import {
  AggregateHasBeenUpdatedSinceError,
  FichierDeRéponseObligatoireError,
  InfraNotAvailableError,
  UnauthorizedError,
} from '@modules/shared'
import {
  fakeRepo,
  fakeTransactionalRepo,
  makeFakeModificationRequest,
  makeFakeProject,
} from '../../../../__tests__/fixtures/aggregates'
import {
  ModificationRequest,
  MODIFICATION_REQUEST_STATUS,
  StatusPreventsAcceptingError,
  VariationPuissanceInterditDecisionJusticeError,
} from '@modules/modificationRequest'
import { Readable } from 'stream'
import { Project } from '@modules/project'
import { okAsync } from '@core/utils'
import { FileObject } from '@modules/file'

describe('Accorder une demande de changement de puissance', () => {
  const utilisateur = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))

  const demandeChangementDePuissance = {
    ...makeFakeModificationRequest(),
    lastUpdatedOn: new Date('2023-01-01'),
    type: 'puissance',
  } as ModificationRequest

  const fakeProject = {
    ...makeFakeProject(),
    id: demandeChangementDePuissance.projectId,
    puissanceInitiale: 10,
  } as Project

  const modificationRequestRepo = {
    ...fakeRepo(demandeChangementDePuissance),
    ...fakeTransactionalRepo(demandeChangementDePuissance),
  }

  const projectRepo = {
    ...fakeRepo(fakeProject),
    ...fakeTransactionalRepo(fakeProject),
  }
  const fileRepo = {
    save: jest.fn((file: FileObject) => okAsync(null)),
    load: jest.fn(),
  }

  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))

  const fakeFileContents = Readable.from('test-content')
  const fakeFileName = 'myfilename.pdf'

  const fichierRéponse = { contents: fakeFileContents, filename: fakeFileName }

  const nouvellePuissance = 100

  beforeEach(() => publishToEventStore.mockClear())

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
          projectRepo,
          fileRepo,
          publishToEventStore,
        })

        const résultat = await accorderChangementDePuissance({
          demandeId: demandeChangementDePuissance.id,
          versionDate: new Date('2023-01-01'),
          utilisateur,
          fichierRéponse,
          isDecisionJustice: false,
          nouvellePuissance,
        })

        expect(résultat.isErr()).toEqual(true)
        if (résultat.isErr()) {
          expect(résultat._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
        }
      })
    }
  })

  describe(`Impossible d'accorder un changement de puissance si la demande n'est pas une décision de justice et qu'elle ne contient pas de fichier de réponse`, () => {
    it(`
    Étant donné un utilisateur avec un rôle autorisé
    Lorsqu'il accorde une demande de changement de puissance qui n'est pas une décision de justice et qui ne contient pas de fichier de réponse
    Alors l'utilisateur devrait être alerté que l'action est impossible car le fichier est obligatoire
    `, async () => {
      const accorderChangementDePuissance = makeAccorderChangementDePuissance({
        modificationRequestRepo,
        projectRepo,
        fileRepo,
        publishToEventStore,
      })
      const résultat = await accorderChangementDePuissance({
        demandeId: demandeChangementDePuissance.id,
        versionDate: new Date('2023-01-01'),
        utilisateur,
        isDecisionJustice: false,
        nouvellePuissance,
      })

      expect(résultat.isErr()).toEqual(true)
      if (résultat.isErr()) {
        expect(résultat.error).toBeInstanceOf(FichierDeRéponseObligatoireError)
      }
    })
  })

  describe(`Impossible d'accorder un changement de puissance si la date de modification est différente de la date de la demande`, () => {
    it(`
     Étant donné un utilisateur avec un rôle autorisé
     Lorsqu'il accorde une demande de changement de puissance mais que la date de modification est différente de la date de demande
     Alors l'utilisateur devrait être alerté que l'action est impossible car il y a eu une mise à jour entre temps    
    `, async () => {
      const accorderChangementDePuissance = makeAccorderChangementDePuissance({
        modificationRequestRepo,
        projectRepo,
        fileRepo,
        publishToEventStore,
      })

      const résultat = await accorderChangementDePuissance({
        demandeId: demandeChangementDePuissance.id,
        versionDate: new Date('2023-01-02'),
        utilisateur,
        fichierRéponse,
        isDecisionJustice: false,
        nouvellePuissance,
      })

      expect(résultat.isErr()).toEqual(true)
      if (résultat.isErr()) {
        expect(résultat.error).toBeInstanceOf(AggregateHasBeenUpdatedSinceError)
      }
    })
  })

  describe(`Impossible d'accorder un changement de puissance si le statut de la demande n'est pas compatible`, () => {
    const statutsIncompatible = MODIFICATION_REQUEST_STATUS.filter(
      (statut) => !['envoyée', 'en attente de confirmation', 'demande confirmée'].includes(statut)
    )
    for (const statut of statutsIncompatible) {
      it(`
      Étant donné un utilisateur avec un rôle autorisé
      Lorsqu'il accorde une demande de changement de puissance alors que celle-ci a un statut ${statut}
      Alors l'utilisateur devrait être informé que l'action est impossible car le statut est incompatible
      `, async () => {
        const demandeChangementDePuissance = {
          ...makeFakeModificationRequest(),
          lastUpdatedOn: new Date('2023-01-01'),
          type: 'puissance',
          status: statut,
        } as ModificationRequest

        const fakeProject = {
          ...makeFakeProject(),
          id: demandeChangementDePuissance.projectId,
          puissanceInitiale: 10,
        } as Project

        const modificationRequestRepo = {
          ...fakeRepo(demandeChangementDePuissance),
          ...fakeTransactionalRepo(demandeChangementDePuissance),
        }

        const projectRepo = {
          ...fakeRepo(fakeProject),
          ...fakeTransactionalRepo(fakeProject),
        }

        const accorderChangementDePuissance = makeAccorderChangementDePuissance({
          modificationRequestRepo,
          projectRepo,
          fileRepo,
          publishToEventStore,
        })
        const résultat = await accorderChangementDePuissance({
          demandeId: demandeChangementDePuissance.id,
          versionDate: new Date('2023-01-01'),
          utilisateur,
          fichierRéponse,
          isDecisionJustice: false,
          nouvellePuissance,
        })

        expect(résultat.isErr()).toEqual(true)
        if (résultat.isErr()) {
          expect(résultat.error).toBeInstanceOf(StatusPreventsAcceptingError)
        }
      })
    }
  })

  describe(`Impossible d'accorder un changement de puissance si la demande est une décision de justice et que l'augmentation de puissance est supérieure au seuil toléré`, () => {
    it(`
    Étant donné un utilisateur avec un rôle autorisé
    Lorsqu'il accorde une demande de changement de puissance qui est une décision de justice et qui a une augmentation de puissance supérieure au seuil toléré
    Alors l'utilisateur devrait être informé que l'augmentation de la puissance est impossible
    `, async () => {
      const accorderChangementDePuissance = makeAccorderChangementDePuissance({
        modificationRequestRepo,
        projectRepo,
        fileRepo,
        publishToEventStore,
      })
      const résultat = await accorderChangementDePuissance({
        demandeId: demandeChangementDePuissance.id,
        versionDate: new Date('2023-01-01'),
        utilisateur,
        isDecisionJustice: true,
        nouvellePuissance: 100,
      })

      expect(résultat.isErr()).toEqual(true)
      if (résultat.isErr()) {
        expect(résultat.error).toBeInstanceOf(VariationPuissanceInterditDecisionJusticeError)
      }
    })
  })

  describe(`Possible d'accorder un changement de puissance`, () => {
    it(`
    Étant donné un utilisateur avec un rôle autorisé
    Lorsqu'il accorde une demande de changement de puissance respectant les conditions de validation
    Alors l'utilisateur devrait être informé que la demande a bien été acceptée
    `, async () => {
      const accorderChangementDePuissance = makeAccorderChangementDePuissance({
        modificationRequestRepo,
        projectRepo,
        fileRepo,
        publishToEventStore,
      })

      const résultat = await accorderChangementDePuissance({
        demandeId: demandeChangementDePuissance.id,
        versionDate: new Date('2023-01-01'),
        utilisateur,
        fichierRéponse,
        isDecisionJustice: false,
        nouvellePuissance,
      })

      expect(résultat.isOk()).toEqual(true)
      if (résultat.isOk()) {
        expect(fileRepo.save).toHaveBeenCalledWith(
          expect.objectContaining({
            designation: 'modification-request-response',
            forProject: demandeChangementDePuissance.projectId,
            filename: fichierRéponse.filename,
            path: `projects/${demandeChangementDePuissance.projectId}/${fakeFileName}`,
          })
        )
        expect(publishToEventStore).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'ChangementDePuissanceAccordé',
            payload: expect.objectContaining({
              demandeId: demandeChangementDePuissance.id.toString(),
              projetId: demandeChangementDePuissance.projectId.toString(),
              accordéPar: utilisateur.id,
              fichierRéponseId: expect.any(String),
            }),
          })
        )
      }
    })
  })
})
