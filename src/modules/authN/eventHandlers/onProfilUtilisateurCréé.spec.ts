import { ProfilUtilisateurCréé } from '@modules/utilisateur'
import { makeOnProfilUtilisateurCréé } from './onProfilUtilisateurCréé'

describe('Handler onProfilUtilisateurCréé', () => {
  it(`Etant donné un évènement ProfilUtilisateurCréé émis,
  alors createUserCredentials devrait être appelée avec les données de l'utilisateur`, async () => {
    const createUserCredentials = jest.fn()

    await makeOnProfilUtilisateurCréé(createUserCredentials)(
      new ProfilUtilisateurCréé({
        payload: {
          email: 'test@test.test',
          role: 'porteur-projet',
          nom: 'nom',
          prénom: 'prénom',
        },
      })
    )

    expect(createUserCredentials).toHaveBeenCalledWith({
      email: 'test@test.test',
      role: 'porteur-projet',
      fullName: 'prénom nom',
    })
  })
})
