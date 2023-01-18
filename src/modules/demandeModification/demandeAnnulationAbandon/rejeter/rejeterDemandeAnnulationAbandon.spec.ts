import { Readable } from 'stream'

import { okAsync } from '@core/utils'
import { User } from '@entities'
import { USER_ROLES } from '@modules/users'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'

import {
  fakeRepo,
  fakeTransactionalRepo,
  makeFakeDemandeAnnulationAbandon,
} from '../../../../__tests__/fixtures/aggregates'
import { makeRejeterDemandeAnnulationAbandon } from './rejeterDemandeAnnulationAbandon'
import { statutsDemandeAnnulationAbandon } from '../DemandeAnnulationAbandon'
import { RejeterDemandeAnnulationAbandonError } from './RejeterDemandeAnnulationAbandonError'

describe(`Rejeter une annulation d'abandon`, () => {
  const demandeId = 'id-demande'
  const fichierRéponse = { contents: Readable.from('test-content'), filename: 'fichier-réponse' }
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))

  beforeEach(() => publishToEventStore.mockClear())

  describe(`Impossible si le rôle de l'utilisateur n'est pas Admin ou DGEC`, () => {
    const rolesNePouvantPasRefuser = USER_ROLES.filter(
      (role) => !['admin', 'dgec-validateur'].includes(role)
    )
    for (const role of rolesNePouvantPasRefuser) {
      it(`Étant donné un utilisateur avec un rôle ${role}
          Lorsqu'il rejette une demande d'annulation d'abandon
          Alors l'utilisateur est informé qu'il n'a pas le droit de faire cette action
      `, async () => {
        const user = { role } as User
        const rejeterDemande = makeRejeterDemandeAnnulationAbandon({
          demandeAnnulationAbandonRepo: fakeTransactionalRepo(makeFakeDemandeAnnulationAbandon()),
          publishToEventStore,
          fileRepo: fakeRepo(),
        })

        const rejet = await rejeterDemande({
          user,
          demandeId,
          fichierRéponse,
        })
        expect(rejet.isErr()).toEqual(true)
        if (rejet.isErr()) {
          expect(rejet._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
          expect(publishToEventStore).not.toHaveBeenCalled()
        }
      })
    }
  })

  describe(`Impossible si le statut de la demande est autre que 'envoyée'`, () => {
    const statutsNePouvantPasÊtreRefusé = statutsDemandeAnnulationAbandon.filter(
      (statut) => statut !== 'envoyée'
    )

    for (const statut of statutsNePouvantPasÊtreRefusé) {
      it(`Étant donné un autre admin ou dgec-validateur
        Lorsqu'il rejette une demande ayant comme statut ${statut}
        Alors l'utilisateur devrait être informé qu'il est impossible de rejeter la demande,
        aucun fichier ne devrait être sauvegardé, et aucun évènement ne devrait être émis`, async () => {
        const user = { role: 'admin' } as User

        const fileRepo = fakeRepo()
        const rejeterDemande = makeRejeterDemandeAnnulationAbandon({
          demandeAnnulationAbandonRepo: fakeTransactionalRepo(
            makeFakeDemandeAnnulationAbandon({ id: demandeId, statut })
          ),
          publishToEventStore,
          fileRepo,
        })
        const rejet = await rejeterDemande({
          user,
          demandeId,
          fichierRéponse,
        })

        expect(rejet.isErr()).toBe(true)
        if (rejet.isErr()) {
          expect(rejet._unsafeUnwrapErr()).toBeInstanceOf(RejeterDemandeAnnulationAbandonError)
          expect(publishToEventStore).not.toHaveBeenCalled()
          expect(fileRepo.save).not.toHaveBeenCalled()
        }
      })
    }

    //   describe(`Etant donné un utilisateur Admin ou DGEC`, () => {
    //     const user = { role: 'admin' } as User
    //     const statutsNePouvantPasÊtreRefusé: StatutDemandeAbandon[] = statutsDemandeAbandon.filter(
    // //       (statut) => !['envoyée', 'en-instruction', 'demande confirmée'].includes(statut)
    //     )
    //     for (const statut of statutsNePouvantPasÊtreRefusé) {
    //       it(`
    //     Lorsqu'il rejette une demande avec comme statut '${statut}'
    //     Alors une erreur RefuserDemandeAbandonError devrait être retournée
    //     Et aucun évènement ne devrait être publié dans le store`, async () => {
    //         const fileRepo = fakeRepo()
    //         const rejeterDemandeAbandon = makeRejeterDemandeAbandon({
    //           demandeAbandonRepo: fakeTransactionalRepo(
    //             makeFakeDemandeAbandon({ id: demandeAbandonId, statut })
    //           ),
    //           publishToEventStore,
    //           fileRepo,
    //         })
    //         const res = await rejeterDemandeAbandon({
    //           user,
    //           demandeAbandonId,
    //           fichierRéponse,
    //         })
    //         const erreurActuelle = res._unsafeUnwrapErr()
    //         expect(erreurActuelle).toBeInstanceOf(RejeterDemandeAbandonError)
    //         expect(publishToEventStore).not.toHaveBeenCalled()
    //         expect(fileRepo.save).not.toHaveBeenCalled()
    //       })
    //     }
    //   })
  })

  // describe(`Possible de rejeter un abandon si Admin/DGEC`, () => {
  //   describe(`Etant donné un utilisateur Admin ou DGEC`, () => {
  //     const user = { role: 'admin', id: 'user-id' } as User

  //     const statutsPouvantÊtreRejetés: StatutDemandeAbandon[] = ['envoyée', 'en-instruction']

  //     for (const statut of statutsPouvantÊtreRejetés) {
  //       it(`
  //     Lorsqu'il rejette une demande d'abandon avec comme statut '${statut}'
  //     Alors le courrier de réponse devrait être sauvegardé
  //     Et l'évenement 'AbandonRejeté' devrait être publié dans le store`, async () => {
  //         const fileRepo = fakeRepo()

  //         const projetId = 'le-projet-de-la-demande'

  //         const rejeterDemandeAbandon = makeRejeterDemandeAbandon({
  //           demandeAbandonRepo: fakeTransactionalRepo(
  //             makeFakeDemandeAbandon({
  //               id: demandeAbandonId,
  //               statut,
  //               projetId,
  //             })
  //           ),
  //           publishToEventStore,
  //           fileRepo,
  //         })

  //         const rejet = await rejeterDemandeAbandon({
  //           user,
  //           demandeAbandonId,
  //           fichierRéponse,
  //         })

  //         expect(rejet.isOk()).toBe(true)
  //         expect(publishToEventStore).toHaveBeenCalledWith(
  //           expect.objectContaining({
  //             type: 'AbandonRejeté',
  //             payload: expect.objectContaining({
  //               demandeAbandonId,
  //               rejetéPar: user.id,
  //               fichierRéponseId: expect.any(String),
  //               projetId,
  //             }),
  //           })
  //         )

  //         expect(fileRepo.save).toHaveBeenCalledWith(
  //           expect.objectContaining({
  //             designation: 'modification-request-response',
  //             forProject: new UniqueEntityID(projetId),
  //             filename: fichierRéponse.filename,
  //             path: `projects/${projetId.toString()}/${fichierRéponse.filename}`,
  //           })
  //         )
  //       })
  //     }
  //   })
  // })
})
