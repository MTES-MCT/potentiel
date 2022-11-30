import { makeInviterUtilisateur } from './inviterUtilisateur'

describe(`Inviter un utilisateur`, () => {
  it(`Lorsqu'on invite un utilisateur avec un role
      Alors l'utilisateur devrait être invité`, async () => {
    const publishToEventStore = jest.fn()

    const inviterUtilisateur = makeInviterUtilisateur({ publishToEventStore })

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
})
