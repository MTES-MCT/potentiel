import { fakeTransactionalRepo } from '../../../__tests__/fixtures/aggregates'
import { Utilisateur } from '../Utilisateur'
import { ProfilDéjàExistantError } from './ProfilDéjàExistantError'
import { makeCréerProfilUtilisateur } from './créerProfilUtilisateur'

describe(`Créer le profil d'un utilisateur`, () => {
  describe(`Création impossible si le profil existe déjà`, () => {
    it(`Lorsque l'on crée un profil pour un utilisateur en ayant déjà un
      Alors on devrait être informé que le profil existe déjà et que sa création est impossible`, async () => {
      const utilisateurRepo = fakeTransactionalRepo({
        statut: 'créé',
      } as Utilisateur)
      const publishToEventStore = jest.fn()

      const créerProfilUtilisateur = makeCréerProfilUtilisateur({
        utilisateurRepo,
        publishToEventStore,
      })

      const création = await créerProfilUtilisateur({
        email: 'utilisateur@email.com',
        role: 'cre',
      })

      expect(création.isErr()).toBe(true)
      expect(création._unsafeUnwrapErr()).toBeInstanceOf(ProfilDéjàExistantError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Création impossible si le rôle est différent de celui de l'invitation`, () => {})

  it(`Lorsque l'on crée un profil d'utilisateur inexistant
      Alors le profil de l'utilisateur devrait être créé avec toutes ces infomrations`, () => {})

  it(`Étant donné un utilisateur invité en tant que 'CRE'
      Lorsque l'on crée un profil pour ce même utilisateur
      Alors le profil de l'utilisateur devrait être créé avec toutes ces infomrations`, () => {})
})
