import { UniqueEntityID } from '@core/domain'
import { makeUtilisateur } from './Utilisateur'
import { ProfilUtilisateurCréé, UtilisateurInvité } from './events'

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
  it(`Quand on fabrique l'agrégat Utilisateur avec un évènement 'ProfilUtilisateurCréé
      Alors l'Utilisateur devrait avoir un statut 'créé'
      Et devrait avoir un email, rôle, nom, prénom et une fonction`, () => {
    const utilisateur = makeUtilisateur({
      id: new UniqueEntityID('email@utilisateur.com'),
      events: [
        new ProfilUtilisateurCréé({
          payload: {
            email: 'email@utilisateur.com',
            role: 'cre',
            nom: 'Nom',
            prénom: 'Prénom',
            fonction: 'Ma fonction',
          },
        }),
      ],
    })

    expect(utilisateur.isOk()).toBe(true)
    utilisateur.isOk() &&
      expect(utilisateur.value).toMatchObject({
        email: 'email@utilisateur.com',
        role: 'cre',
        statut: 'créé',
        nom: 'Nom',
        prénom: 'Prénom',
        fonction: 'Ma fonction',
      })
  })
})
