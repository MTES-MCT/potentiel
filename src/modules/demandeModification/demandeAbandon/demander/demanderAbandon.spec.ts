import { Readable } from 'stream'
import { makeDemanderAbandon } from '@modules/demandeModification'
import { Project } from '@modules/project'
import { Repository } from '@core/domain'
import { okAsync } from '@core/utils'
import { FileObject } from '@modules/file'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { AppelOffreRepo } from '@dataAccess/inMemory'
import makeFakeProject from '../../../../__tests__/fixtures/project'

import { AppelOffre } from '@entities'

describe('Commande demanderAbandon', () => {
  const user = makeFakeUser({ role: 'porteur-projet' })

  const getProjectAppelOffreId = jest.fn(() =>
    okAsync<string, EntityNotFoundError | InfraNotAvailableError>('appelOffreId')
  )
  const findAppelOffreById: AppelOffreRepo['findById'] = async () =>
    ({
      id: 'appelOffreId',
      choisirNouveauCahierDesCharges: true,
      periodes: [{ id: 'periodeId', type: 'notified' }],
      familles: [{ id: 'familleId' }],
    } as AppelOffre)

  const fakeProject = makeFakeProject()

  const fileRepo = {
    save: jest.fn(() => okAsync(null)),
    load: jest.fn(),
  }

  const fakeFileContents = {
    filename: 'fakeFile.pdf',
    contents: Readable.from('test-content'),
  }

  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))

  beforeEach(() => publishToEventStore.mockClear())

  describe(`Demande d'abandon impossible si le porteur n'a pas les droits sur le projet`, () => {
    describe(`Etant donné un porteur n'ayant pas les droits sur le projet`, () => {
      const shouldUserAccessProject = jest.fn(async () => false)
      it(`Lorsque le porteur fait une demande d'abandon,
      alors, une erreur est retournée`, async () => {
        const demanderAbandon = makeDemanderAbandon({
          fileRepo,
          findAppelOffreById,
          publishToEventStore,
          shouldUserAccessProject,
          getProjectAppelOffreId,
        })

        const requestResult = await demanderAbandon({
          justification: 'justification',
          file: fakeFileContents,
          user,
          projectId: fakeProject.id.toString(),
        })

        expect(shouldUserAccessProject).toHaveBeenCalledWith({
          user,
          projectId: fakeProject.id.toString(),
        })

        expect(fileRepo.save).not.toHaveBeenCalled()
        expect(requestResult.isErr()).toEqual(true)
        if (requestResult.isOk()) return
        expect(requestResult.error).toBeInstanceOf(UnauthorizedError)
      })
    })
  })

  describe(`Demande d'abandon possible si le porteur a les droits sur le projet`, () => {
    describe(`Etant donné un porteur ayant les droits sur le projet`, () => {
      const shouldUserAccessProject = jest.fn(async () => true)
      describe(`Enregistrer la demande d'abandon'`, () => {
        describe(`Lorsque le porteur fait une demande d'abandon'`, () => {
          it(`Alors un événement AbandonDemandé devrait être émis`, async () => {
            const demanderAbandon = makeDemanderAbandon({
              fileRepo: fileRepo as Repository<FileObject>,
              findAppelOffreById,
              publishToEventStore,
              shouldUserAccessProject,
              getProjectAppelOffreId,
            })

            await demanderAbandon({
              justification: 'justification',
              user,
              projectId: fakeProject.id.toString(),
            })

            expect(publishToEventStore).toHaveBeenNthCalledWith(
              1,
              expect.objectContaining({
                type: 'AbandonDemandé',
                payload: expect.objectContaining({ projetId: fakeProject.id.toString() }),
              })
            )
          })
        })
      })
      describe(`Enregistrer le fichier joint à la demande`, () => {
        describe(`Lorsque le porteur fait une demande d'abandon avec fichier joint`, () => {
          it(`Alors le fichier doit être enregistré`, async () => {
            const demanderAbandon = makeDemanderAbandon({
              fileRepo: fileRepo as Repository<FileObject>,
              findAppelOffreById,
              publishToEventStore,
              shouldUserAccessProject,
              getProjectAppelOffreId,
            })

            await demanderAbandon({
              justification: 'justification',
              user,
              projectId: fakeProject.id.toString(),
              file: fakeFileContents,
            })

            expect(fileRepo.save).toHaveBeenCalledWith(
              expect.objectContaining({ contents: fakeFileContents.contents })
            )
          })
        })
      })
    })
  })
})
