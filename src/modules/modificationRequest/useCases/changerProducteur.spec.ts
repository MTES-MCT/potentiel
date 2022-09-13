import { DomainEvent, Repository } from '@core/domain'
import { okAsync } from '@core/utils'
import { makeUser, AppelOffre } from '@entities'
import { Readable } from 'stream'
import { UnwrapForTest } from '../../../types'
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { FileObject } from '../../file'
import { Project } from '../../project'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { makeChangerProducteur } from './changerProducteur'
import { AppelOffreRepo } from '@dataAccess/inMemory'
import { ModificationReceived } from '../events'
import { NouveauCahierDesChargesNonChoisiError } from '@modules/demandeModification'
import { ToutAccèsAuProjetRevoqué } from '@modules/authZ'

describe('Commande changerProducteur', () => {
  const shouldUserAccessProject = jest.fn(async () => true)
  const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))
  const fakeProject = { ...makeFakeProject(), producteur: 'initial producteur' }
  const projectRepo = fakeTransactionalRepo(fakeProject as Project)
  const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null))
  const eventBus = {
    publish: fakePublish,
    subscribe: jest.fn(),
  }

  const findAppelOffreById: AppelOffreRepo['findById'] = async () =>
    ({
      id: 'appelOffreId',
      periodes: [{ id: 'periodeId', type: 'notified' }],
      familles: [{ id: 'familleId' }],
    } as AppelOffre)

  const fileRepo = {
    save: jest.fn((file: FileObject) => okAsync(null)),
    load: jest.fn(),
  }
  const fakeFileContents = Readable.from('test-content')
  const fakeFileName = 'myfilename.pdf'

  describe(`Impossible de changer de producteur sans avoir les droits sur le projet`, () => {
    describe(`Etant donné un porteur de projet n'ayant pas les droits sur le projet`, () => {
      it(`Lorsque le porteur change de producteur,
        alors une erreur UnauthorizedError devrait être retournée`, async () => {
        fakePublish.mockClear()
        fileRepo.save.mockClear()

        const shouldUserAccessProject = jest.fn(async () => false)

        const changerProducteur = makeChangerProducteur({
          projectRepo,
          eventBus,
          shouldUserAccessProject,
          fileRepo: fileRepo as Repository<FileObject>,
          findAppelOffreById,
        })

        const res = await changerProducteur({
          projetId: fakeProject.id.toString(),
          porteur: fakeUser,
          nouveauProducteur: 'new producteur',
        })

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
        expect(fakePublish).not.toHaveBeenCalled()
      })
    })
  })

  describe(`Impossible de changer de producteur sans avoir souscri au CDC pour les AO concernés`, () => {
    describe(`Etant donné un porteur de projet ayant les droits sur 
            un projet concerné par le changement de CDC, 
            et pour lequel le nouveau CDC n'a pas été souscri, `, () => {
      it(`Lorsque le porteur change de producteur,
        alors une erreur NouveauCahierDesChargesNonChoisiError devrait être retournée`, async () => {
        fakePublish.mockClear()
        fileRepo.save.mockClear()

        const shouldUserAccessProject = jest.fn(async () => true)

        const fakeProject = {
          ...makeFakeProject(),
          producteur: 'initial producteur',
          nouvellesRèglesDInstructionChoisies: false,
        }
        const projectRepo = fakeTransactionalRepo(fakeProject as Project)

        const findAppelOffreById: AppelOffreRepo['findById'] = async () =>
          ({
            id: 'appelOffreId',
            periodes: [{ id: 'periodeId', type: 'notified' }],
            familles: [{ id: 'familleId' }],
            choisirNouveauCahierDesCharges: true,
          } as AppelOffre)

        const changerProducteur = makeChangerProducteur({
          projectRepo,
          eventBus,
          shouldUserAccessProject,
          fileRepo: fileRepo as Repository<FileObject>,
          findAppelOffreById,
        })

        const res = await changerProducteur({
          projetId: fakeProject.id.toString(),
          porteur: fakeUser,
          nouveauProducteur: 'new producteur',
        })

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(NouveauCahierDesChargesNonChoisiError)
        expect(fakePublish).not.toHaveBeenCalled()
      })
    })
  })

  describe('Changement de producteur possible', () => {
    describe(`Etant donné un porteur ayant les droits sur le projet,
    Lorsqu'il change de producteur, alors : `, () => {
      const newProducteur = 'new producteur'

      beforeAll(async () => {
        fakePublish.mockClear()
        fileRepo.save.mockClear()
        const changerProducteur = makeChangerProducteur({
          projectRepo,
          eventBus,
          shouldUserAccessProject,
          fileRepo: fileRepo as Repository<FileObject>,
          findAppelOffreById,
        })

        const res = await changerProducteur({
          projetId: fakeProject.id.toString(),
          porteur: fakeUser,
          nouveauProducteur: newProducteur,
          fichier: { contents: fakeFileContents, filename: fakeFileName },
        })

        expect(res.isOk()).toBe(true)

        expect(shouldUserAccessProject).toHaveBeenCalledWith({
          user: fakeUser,
          projectId: fakeProject.id.toString(),
        })
      })

      it('Le producteur devrait être mis à jour', () => {
        expect(fakeProject.updateProducteur).toHaveBeenCalledWith(fakeUser, 'new producteur')
      })

      it(`Un événement ModificationReceived devrait être émis`, async () => {
        expect(eventBus.publish).toHaveBeenCalledTimes(2)
        const event = eventBus.publish.mock.calls[0][0]
        expect(event).toBeInstanceOf(ModificationReceived)

        const { type, producteur } = event.payload
        expect(type).toEqual('producteur')
        expect(producteur).toEqual(newProducteur)
      })

      it(`Le fichier devrait être sauvegardé`, () => {
        expect(fileRepo.save).toHaveBeenCalledTimes(1)
        expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents)
        expect(fileRepo.save.mock.calls[0][0].filename).toEqual(fakeFileName)
      })
    })
  })

  describe('Révocation des droits sur le projet', () => {
    it(`Etant donné un porteur ayant les droits sur un projet,
          lorsqu'il fait un changement de producteur,
          alors un événement ToutAccèsAuProjetRevoqué devrait être émis`, async () => {
      fakePublish.mockClear()
      fileRepo.save.mockClear()

      const changerProducteur = makeChangerProducteur({
        projectRepo,
        eventBus,
        shouldUserAccessProject,
        fileRepo: fileRepo as Repository<FileObject>,
        findAppelOffreById,
      })

      const res = await changerProducteur({
        projetId: fakeProject.id.toString(),
        porteur: fakeUser,
        nouveauProducteur: 'newProducteur',
      })

      expect(res.isOk()).toBe(true)

      expect(eventBus.publish).toHaveBeenCalledTimes(2)

      const révocationDroitsEvenement = eventBus.publish.mock.calls[1][0]
      expect(révocationDroitsEvenement).toBeInstanceOf(ToutAccèsAuProjetRevoqué)
      expect(révocationDroitsEvenement.payload.projetId).toEqual(fakeProject.id.toString())
    })
  })
})
