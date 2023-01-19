import { Readable } from 'stream'

import { okAsync } from '@core/utils'
import { User } from '@entities'
import { USER_ROLES } from '@modules/users'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'

import { fakeRepo, fakeTransactionalRepo } from '../../../../__tests__/fixtures/aggregates'
import { makeRejeterDemandeAnnulationAbandon } from './rejeterDemandeAnnulationAbandon'
import {
  DemandeAnnulationAbandon,
  statutsDemandeAnnulationAbandon,
} from '../DemandeAnnulationAbandon'
import { RejeterDemandeAnnulationAbandonError } from './RejeterDemandeAnnulationAbandonError'
import { UniqueEntityID } from '@core/domain'

describe(`Rejeter une annulation d'abandon`, () => {
  const demandeId = 'id-demande'
  const fichierRéponse = { contents: Readable.from('test-content'), filename: 'fichier-réponse' }
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))
  const fileRepo = fakeRepo()
  const projetId = 'le-projet-de-la-demande'

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
          demandeAnnulationAbandonRepo: fakeTransactionalRepo(),
          publishToEventStore,
          fileRepo,
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
      it(`Étant donné un utilisateur admin ou dgec-validateur
        Lorsqu'il rejette une demande ayant comme statut ${statut}
        Alors l'utilisateur devrait être informé qu'il est impossible de rejeter la demande`, async () => {
        const user = { role: 'admin' } as User

        const rejeterDemande = makeRejeterDemandeAnnulationAbandon({
          demandeAnnulationAbandonRepo: fakeTransactionalRepo({
            statut,
            projetId,
          } as DemandeAnnulationAbandon),
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
  })

  describe(`Possible de rejeter une demande d'annulation d'abandon`, () => {
    it(`Étant donné un utilisateur admin ou dgec-validateur
        Lorsqu'il rejette une demande d'abandon ayant le bon statut (envoyée)
        Alors l'utilisateur devrait être informé que la demande a bien été rejetée
        Et son courrier de réponse devrait être sauvezgardé`, async () => {
      const user = { role: 'admin', id: 'user-id' } as User
      const rejeterDemande = makeRejeterDemandeAnnulationAbandon({
        demandeAnnulationAbandonRepo: fakeTransactionalRepo({
          statut: 'envoyée',
          projetId,
        } as DemandeAnnulationAbandon),
        publishToEventStore,
        fileRepo,
      })
      const rejet = await rejeterDemande({
        user,
        demandeId,
        fichierRéponse,
      })

      expect(fileRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          designation: 'modification-request-response',
          forProject: new UniqueEntityID(projetId),
          filename: fichierRéponse.filename,
          path: `projects/${projetId.toString()}/${fichierRéponse.filename}`,
        })
      )

      expect(rejet.isOk()).toBe(true)
      expect(publishToEventStore).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'AnnulationAbandonRejetée',
          payload: expect.objectContaining({
            demandeId,
            rejetéPar: user.id,
            fichierRéponseId: expect.any(String),
            projetId,
          }),
        })
      )
    })
  })
})
