import { Readable } from 'stream'
import { PuissanceJustificationEtCourrierManquantError } from './PuissanceJustificationEtCourrierManquantError'
import { DomainEvent, Repository } from '@core/domain'
import { okAsync } from '@core/utils'
import { makeUser } from '@entities'
import { UnwrapForTest } from '../../../../types'
import { fakeTransactionalRepo, makeFakeProject } from '../../../../__tests__/fixtures/aggregates'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { FileObject } from '@modules/file'
import { Project } from '@modules/project'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { ModificationRequested } from '@modules/modificationRequest/events'
import { makeDemanderChangementDePuissance } from './demanderChangementDePuissance'
import { ChangementDePuissanceDemandé } from '@modules/demandeModification/demandeChangementDePuissance/events/ChangementDePuissanceDemandé'

describe('Commande requestPuissanceModification', () => {
  const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))
  const fakeProject = {
    ...makeFakeProject(),
    puissanceInitiale: 100,
    cahierDesCharges: { type: 'initial' },
  }
  const projectRepo = fakeTransactionalRepo(fakeProject as Project)
  const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null))
  const eventBus = {
    publish: fakePublish,
    subscribe: jest.fn(),
  }
  const fileRepo = {
    save: jest.fn((file: FileObject) => okAsync(null)),
    load: jest.fn(),
  }
  const file = { contents: Readable.from('test-content'), filename: 'myfilename.pdf' }
  const getPuissanceProjet = jest.fn((projectId: string) => okAsync(123))

  beforeEach(async () => {
    fakePublish.mockClear()
    fileRepo.save.mockClear()
  })

  describe(`Lorsque le porteur n'a pas les droits sur le projet`, () => {
    const shouldUserAccessProject = jest.fn(async () => false)
    const requestPuissanceModification = makeDemanderChangementDePuissance({
      projectRepo,
      eventBus,
      getPuissanceProjet,
      shouldUserAccessProject,
      exceedsRatiosChangementPuissance: () => false,
      exceedsPuissanceMaxDuVolumeReserve: () => false,
      fileRepo: fileRepo as Repository<FileObject>,
    })
    const newPuissance = 89

    it(`Lorsqu'un fait une demande de changement de puissance
    alors une erreur de type UnauthorizedError devrait être émise
    et la demande ne devrait pas être envoyée`, async () => {
      fakePublish.mockClear()
      fileRepo.save.mockClear()

      const res = await requestPuissanceModification({
        projectId: fakeProject.id.toString(),
        requestedBy: fakeUser,
        newPuissance,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
      expect(fakePublish).not.toHaveBeenCalled()
    })
  })

  describe(`Lorsque le porteur a les droits sur le projet`, () => {
    const shouldUserAccessProject = jest.fn(async () => true)

    describe(`Cas d'une demande qui n'est pas auto-acceptée`, () => {
      describe(`Erreur à émettre si courrier ou justification manquant pour un CDC autre que 2022`, () => {
        describe(`Etant donné un projet dont le CDC applicable est le CDC initial`, () => {
          it(`Lorsque le porteur fait une demande de changement puissance sans courrier ni justification,
        alors une erreur devrait être retournée et le changement ne devrait pas être enregistré`, async () => {
            const requestPuissanceModification = makeDemanderChangementDePuissance({
              projectRepo,
              eventBus,
              getPuissanceProjet,
              shouldUserAccessProject,
              exceedsRatiosChangementPuissance: () => true,
              exceedsPuissanceMaxDuVolumeReserve: () => false,
              fileRepo: fileRepo as Repository<FileObject>,
            })

            const newPuissance = 89

            const res = await requestPuissanceModification({
              projectId: fakeProject.id.toString(),
              requestedBy: fakeUser,
              newPuissance,
            })

            expect(res.isErr()).toBe(true)
            if (res.isOk()) return
            expect(res.error).toBeInstanceOf(PuissanceJustificationEtCourrierManquantError)
          })
        })
      })

      describe(`Demande sans courrier ni justificatif pour projet soumis au CDC 2022`, () => {
        describe(`Etant donné un projet dont le CDC applicable est celui du 30/08/22`, () => {
          it(`Lorsque le porteur fait une demande de changement puissance sans courrier ni justification,
        alors la demande devrait être envoyée`, async () => {
            const fakeProject = {
              ...makeFakeProject(),
              puissanceInitiale: 100,
              cahierDesCharges: { type: 'modifié', paruLe: '30/08/2022' },
            }
            const projectRepo = fakeTransactionalRepo(fakeProject as Project)
            const requestPuissanceModification = makeDemanderChangementDePuissance({
              projectRepo,
              eventBus,
              getPuissanceProjet,
              shouldUserAccessProject,
              exceedsRatiosChangementPuissance: () => true,
              exceedsPuissanceMaxDuVolumeReserve: () => false,
              fileRepo: fileRepo as Repository<FileObject>,
            })

            const newPuissance = 89

            const res = await requestPuissanceModification({
              projectId: fakeProject.id.toString(),
              requestedBy: fakeUser,
              newPuissance,
            })

            expect(res.isOk()).toBe(true)
            if (res.isErr()) return

            expect(eventBus.publish).toHaveBeenCalledTimes(1)
            const event = eventBus.publish.mock.calls[0][0]
            expect(event).toBeInstanceOf(ModificationRequested)
            expect(event).toMatchObject({
              payload: {
                type: 'puissance',
                puissance: newPuissance,
                puissanceAuMomentDuDepot: 123,
                cahierDesCharges: '30/08/2022',
              },
            })
          })
        })
      })

      describe(`Demande avec courrier et justificatif pour projet soumis au CDC 2021`, () => {
        describe(`Etant donné un projet dont le CDC applicable n'est pas celui du 30/08/22`, () => {
          it(`Lorsque le porteur fait une demande de changement puissance avec courrier et justification,
        alors la demande devrait être envoyée,
        le fichier devrait être enregistré
        et le projet ne devrait pas être modifié`, async () => {
            const requestPuissanceModification = makeDemanderChangementDePuissance({
              projectRepo,
              eventBus,
              getPuissanceProjet,
              shouldUserAccessProject,
              exceedsRatiosChangementPuissance: () => true,
              exceedsPuissanceMaxDuVolumeReserve: () => false,
              fileRepo: fileRepo as Repository<FileObject>,
            })
            const res = await requestPuissanceModification({
              projectId: fakeProject.id.toString(),
              requestedBy: fakeUser,
              newPuissance: 90,
              fichier: file,
            })

            expect(res.isOk()).toBe(true)

            expect(shouldUserAccessProject).toHaveBeenCalledWith({
              user: fakeUser,
              projectId: fakeProject.id.toString(),
            })

            expect(eventBus.publish).toHaveBeenCalledTimes(1)
            const event = eventBus.publish.mock.calls[0][0]
            expect(event).toBeInstanceOf(ModificationRequested)

            expect(event).toMatchObject({
              payload: {
                type: 'puissance',
                puissance: 90,
                puissanceAuMomentDuDepot: 123,
                cahierDesCharges: 'initial',
              },
            })

            expect(fakeProject.pendingEvents).toHaveLength(0)

            expect(fileRepo.save).toHaveBeenCalledTimes(1)
            expect(fileRepo.save.mock.calls[0][0].contents).toEqual(file.contents)
            expect(fileRepo.save.mock.calls[0][0].filename).toEqual(file.filename)
          })
        })
      })
    })

    describe('Cas des demandes auto-acceptées', () => {
      it(`Etant donné une demande de changement de puissance qui ne sort pas des ratios de l'AO,
      alors la demande devrait être envoyée,
      le projet devrait être modifié
      et le fichier devrait être sauvegardé`, async () => {
        const requestPuissanceModification = makeDemanderChangementDePuissance({
          projectRepo,
          eventBus,
          getPuissanceProjet,
          shouldUserAccessProject,
          exceedsRatiosChangementPuissance: () => false,
          exceedsPuissanceMaxDuVolumeReserve: () => false,
          fileRepo: fileRepo as Repository<FileObject>,
        })
        const newPuissance = 105

        const res = await requestPuissanceModification({
          projectId: fakeProject.id.toString(),
          requestedBy: fakeUser,
          newPuissance,
          fichier: file,
        })

        expect(res.isOk()).toBe(true)

        expect(shouldUserAccessProject).toHaveBeenCalledWith({
          user: fakeUser,
          projectId: fakeProject.id.toString(),
        })

        expect(eventBus.publish).toHaveBeenCalledTimes(1)
        const event = eventBus.publish.mock.calls[0][0]
        expect(event).toBeInstanceOf(ChangementDePuissanceDemandé)
        expect(event).toMatchObject({
          payload: {
            type: 'puissance',
            puissance: newPuissance,
            puissanceAuMomentDuDepot: 123,
            cahierDesCharges: 'initial',
          },
        })

        expect(fakeProject.updatePuissance).toHaveBeenCalledWith(fakeUser, newPuissance)

        expect(fileRepo.save).toHaveBeenCalledTimes(1)
        expect(fileRepo.save.mock.calls[0][0].contents).toEqual(file.contents)
        expect(fileRepo.save.mock.calls[0][0].filename).toEqual(file.filename)
      })
    })
  })
})
