import { Project } from '@modules/project'
import { okAsync } from '@core/utils'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { AppelOffreRepo } from '@dataAccess/inMemory'
import makeFakeProject from '../../../../__tests__/fixtures/project'

import { AppelOffre } from '@entities'
import { fakeRepo } from '../../../../__tests__/fixtures/aggregates'
import { makeDemanderAnnulationAbandon } from './demanderAnnulationAbandon'
import { ProjetNonAbandonnéError } from './ProjetNonAbandonnéError'
import { CDCIncompatibleAvecAnnulationAbandonError } from './CDCIncompatibleAvecAnnulationAbandonError'

describe(`Demander une annulation d'abandon`, () => {
  const user = makeFakeUser({ role: 'porteur-projet' })

  const getProjectAppelOffreId = jest.fn(() =>
    okAsync<string, EntityNotFoundError | InfraNotAvailableError>('appelOffreId')
  )
  const findAppelOffreById: AppelOffreRepo['findById'] = async () =>
    ({
      id: 'appelOffreId',
      periodes: [{ id: 'periodeId', type: 'notified' }],
      familles: [{ id: 'familleId' }],
    } as AppelOffre)

  const fakeProject = makeFakeProject()

  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))

  beforeEach(() => publishToEventStore.mockClear())

  describe(`Demande impossible si le porteur n'a pas les droits sur le projet`, () => {
    it(`Etant donné un porteur n'ayant pas les droits sur le projet
          Lorsque le porteur fait une demande d'annulation d'abandon,
          Alors le porteur est informé qu'il n'a pas l'accès à ce projet`, async () => {
      const projectRepo = fakeRepo({
        ...fakeProject,
        isClasse: true,
      } as Project)

      const demanderAnnulationAbandon = makeDemanderAnnulationAbandon({
        findAppelOffreById,
        publishToEventStore,
        shouldUserAccessProject: async () => false,
        getProjectAppelOffreId,
        projectRepo,
      })

      const demandeAnnulationAbandon = await demanderAnnulationAbandon({
        user,
        projetId: fakeProject.id.toString(),
      })

      expect(demandeAnnulationAbandon.isErr()).toEqual(true)
      demandeAnnulationAbandon.isErr() &&
        expect(demandeAnnulationAbandon.error).toBeInstanceOf(UnauthorizedError)
    })
  })

  describe(`Demande impossible si le projet n'est pas abandonné`, () => {
    it(`
      Étant donné un porteur ayant les droits sur le projet
      Lorsqu'il fait une demande d'annulation d'abandon pour un projet non abandonné,
      Alors le porteur est informé que cette action est impossible`, async () => {
      const fakeProject = makeFakeProject()
      const projectRepo = fakeRepo({
        ...fakeProject,
        isClasse: true,
        abandonedOn: 0,
      } as Project)

      const demanderAnnulationAbandon = makeDemanderAnnulationAbandon({
        findAppelOffreById,
        publishToEventStore,
        shouldUserAccessProject: jest.fn(async () => true),
        getProjectAppelOffreId,
        projectRepo,
      })

      const demande = await demanderAnnulationAbandon({
        user,
        projetId: fakeProject.id.toString(),
      })

      expect(demande.isErr()).toEqual(true)
      demande.isErr() && expect(demande.error).toBeInstanceOf(ProjetNonAbandonnéError)
    })
  })

  describe(`Demande impossible si le CDC du projet n'autorise pas l'annulation d'un abandon`, () => {
    it(`Etant donné un porteur ayant accès au projet,
      lorsqu'il fait une demande d'annulation d'abandon pour un projet dont le CDC ne permet cette action,
      alors le porteur devrait être informé qu'il doit d'abord changer de CDC`, async () => {
      const projectRepo = fakeRepo({
        ...fakeProject,
        cahierDesCharges: {
          type: 'modifié',
          paruLe: '30/08/2022',
          annulationAbandonPossible: undefined,
        },
        isClasse: true,
      } as Project)

      const demanderAnnulationAbandon = makeDemanderAnnulationAbandon({
        findAppelOffreById,
        publishToEventStore,
        shouldUserAccessProject: jest.fn(async () => true),
        getProjectAppelOffreId,
        projectRepo,
      })

      const demande = await demanderAnnulationAbandon({
        user,
        projetId: fakeProject.id.toString(),
      })

      expect(demande.isErr()).toEqual(true)
      demande.isErr() &&
        expect(demande.error).toBeInstanceOf(CDCIncompatibleAvecAnnulationAbandonError)
    })
  })
})

//   describe(`Demande possible si le porteur a les droits sur le projet`, () => {
//     describe(`Etant donné un porteur ayant les droits sur le projet`, () => {
//       const projectRepo = fakeRepo({
//         ...fakeProject,
//         cahierDesCharges: { paruLe: '30/07/2021' },
//         isClasse: true,
//       } as Project)
//       describe(`Enregistrer la demande d'abandon'`, () => {
//         describe(`Lorsque le porteur fait une demande d'abandon'`, () => {
//           it(`Alors un événement AbandonDemandé devrait être émis`, async () => {
//             const demanderAbandon = makeDemanderAbandon({
//               fileRepo: fileRepo as Repository<FileObject>,
//               findAppelOffreById,
//               publishToEventStore,
//               shouldUserAccessProject,
//               getProjectAppelOffreId,
//               projectRepo,
//             })

//             await demanderAbandon({
//               justification: 'justification',
//               user,
//               projectId: fakeProject.id.toString(),
//             })

//             expect(publishToEventStore).toHaveBeenNthCalledWith(
//               1,
//               expect.objectContaining({
//                 type: 'AbandonDemandé',
//                 payload: expect.objectContaining({
//                   projetId: fakeProject.id.toString(),
//                   cahierDesCharges: '30/07/2021',
//                 }),
//               })
//             )
//           })
//         })
//       })
//       describe(`Enregistrer le fichier joint à la demande`, () => {
//         describe(`Lorsque le porteur fait une demande d'abandon avec fichier joint`, () => {
//           it(`Alors le fichier doit être enregistré`, async () => {
//             const demanderAbandon = makeDemanderAbandon({
//               fileRepo: fileRepo as Repository<FileObject>,
//               findAppelOffreById,
//               publishToEventStore,
//               shouldUserAccessProject,
//               getProjectAppelOffreId,
//               projectRepo,
//             })

//             await demanderAbandon({
//               justification: 'justification',
//               user,
//               projectId: fakeProject.id.toString(),
//               file: fakeFileContents,
//             })

//             expect(fileRepo.save).toHaveBeenCalledWith(
//               expect.objectContaining({ contents: fakeFileContents.contents })
//             )
//           })
//         })
//       })
//     })
//   })
