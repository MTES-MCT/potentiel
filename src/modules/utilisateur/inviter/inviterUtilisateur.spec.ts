import { Utilisateur } from '../Utilisateur'
import { fakeTransactionalRepo } from '../../../__tests__/fixtures/aggregates'
import { makeInviterUtilisateur } from './inviterUtilisateur'
import { InvitationUniqueParUtilisateurError } from './InvitationUniqueParUtilisateurError'
import { InvitationUtilisateurExistantError } from './InvitationUtilisateurExistantError'

describe(`Inviter un utilisateur`, () => {
  it(`Lorsqu'on invite un utilisateur avec un role
      Alors l'utilisateur devrait être invité`, async () => {
    const utilisateurRepo = fakeTransactionalRepo({ statut: undefined } as Utilisateur)
    const publishToEventStore = jest.fn()

    const inviterUtilisateur = makeInviterUtilisateur({ utilisateurRepo, publishToEventStore })

    await inviterUtilisateur({
      email: 'utilisateur@email.com',
      role: 'cre',
    })

    expect(publishToEventStore).toHaveBeenCalledWith(
      expect.objectContaining({
        aggregateId: 'utilisateur@email.com',
        type: 'UtilisateurInvité',
        payload: {
          email: 'utilisateur@email.com',
          role: 'cre',
        },
      })
    )
  })
  describe(`Impossible d'inviter 2 fois le même utilisateur`, () => {
    it(`Lorsqu'on invite un utilisateur déjà invité
      Alors aucun évènement ne devrait être émis
      Et on devrait être averti qu'il est impossible d'inviter 2 fois le même utilisateur`, async () => {
      const utilisateurRepo = fakeTransactionalRepo({
        statut: 'invité',
      } as Utilisateur)
      const publishToEventStore = jest.fn()

      const inviterUtilisateur = makeInviterUtilisateur({
        utilisateurRepo,
        publishToEventStore,
      })

      const invitation = await inviterUtilisateur({
        email: 'utilisateur@email.com',
        role: 'cre',
      })

      expect(invitation.isErr()).toBe(true)
      expect(invitation._unsafeUnwrapErr()).toBeInstanceOf(InvitationUniqueParUtilisateurError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Impossible d'inviter un utilisateur existant`, () => {
    it(`Lorsqu'on invite un utilisateur déjà créé
      Alors aucun évènement ne devrait être émis
      Et on devrait être averti qu'il est impossible d'inviter un utilisateur existant`, async () => {
      const utilisateurRepo = fakeTransactionalRepo({
        statut: 'créé',
      } as Utilisateur)
      const publishToEventStore = jest.fn()

      const inviterUtilisateur = makeInviterUtilisateur({
        utilisateurRepo,
        publishToEventStore,
      })

      const invitation = await inviterUtilisateur({
        email: 'utilisateur@email.com',
        role: 'cre',
      })

      expect(invitation.isErr()).toBe(true)
      expect(invitation._unsafeUnwrapErr()).toBeInstanceOf(InvitationUtilisateurExistantError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })
})
