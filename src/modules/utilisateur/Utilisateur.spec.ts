import { UniqueEntityID } from '@core/domain'
import { makeUtilisateur } from './Utilisateur'
import { UtilisateurInvité } from './events/UtilisateurInvité'

describe(`Fabriquer l'agrégat Utilisateur`, () => {
  it(`Quand on fabrique l'agrégat Utilisateur avec un évènement 'UtilisateurInvité
        Alors l'Utilisateur devrait avoir un statut 'invité
        Et devrait avoir un email et un rôle`, () => {
    const utilisateur = makeUtilisateur({
      id: new UniqueEntityID('email@utilisateur.com'),
      events: [
        new UtilisateurInvité({
          payload: {
            email: 'email@utilisateur.com',
            role: 'cre',
          },
        }),
      ],
    })

    expect(utilisateur.isOk()).toBe(true)
    utilisateur.isOk() &&
      expect(utilisateur.value).toMatchObject({
        email: 'email@utilisateur.com',
        role: 'cre',
        statut: 'invité',
      })
  })
})
