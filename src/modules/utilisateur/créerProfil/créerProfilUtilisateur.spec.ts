import { fakeTransactionalRepo } from '../../../__tests__/fixtures/aggregates'
import { Utilisateur } from '../Utilisateur'
import { ProfilDéjàExistantError } from './ProfilDéjàExistantError'
import { RoleIncorrectError } from './RoleIncorrectError'
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
        nom: 'Nom',
        prénom: 'Prénom',
        fonction: 'Ma fonction',
      })

      expect(création.isErr()).toBe(true)
      expect(création._unsafeUnwrapErr()).toBeInstanceOf(ProfilDéjàExistantError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Création impossible si le rôle est différent de celui de l'invitation`, () => {
    it(`Étant donné un utilisateur invité avec le role CRE
        Lorsque l'on crée un profil pour cet utilisateur mais avec le role Admin
        Alors on devrait être informé que le rôle ne correspond pas à celui de l'invitation`, async () => {
      const utilisateurRepo = fakeTransactionalRepo({
        statut: 'invité',
        role: 'cre',
      } as Utilisateur)
      const publishToEventStore = jest.fn()

      const créerProfilUtilisateur = makeCréerProfilUtilisateur({
        utilisateurRepo,
        publishToEventStore,
      })

      const création = await créerProfilUtilisateur({
        email: 'utilisateur@email.com',
        nom: 'Nom',
        prénom: 'Prénom',
        fonction: 'Ma fonction',
      })

      expect(création.isErr()).toBe(true)
      expect(création._unsafeUnwrapErr()).toBeInstanceOf(RoleIncorrectError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  it(`Lorsque l'on crée un profil d'utilisateur inexistant
      Alors le profil de l'utilisateur devrait être créé avec toutes ces informations`, async () => {
    const utilisateurRepo = fakeTransactionalRepo({} as Utilisateur)
    const publishToEventStore = jest.fn()

    const créerProfilUtilisateur = makeCréerProfilUtilisateur({
      utilisateurRepo,
      publishToEventStore,
    })

    await créerProfilUtilisateur({
      email: 'utilisateur@email.com',
      nom: 'Nom',
      prénom: 'Prénom',
      fonction: 'Ma fonction',
    })

    expect(publishToEventStore).toHaveBeenCalledWith(
      expect.objectContaining({
        aggregateId: 'utilisateur@email.com',
        type: 'ProfilUtilisateurCréé',
        payload: {
          email: 'utilisateur@email.com',
          role: 'cre',
          nom: 'Nom',
          prénom: 'Prénom',
          fonction: 'Ma fonction',
        },
      })
    )
  })

  it(`Étant donné un utilisateur invité en tant que 'CRE'
      Lorsque l'on crée un profil pour ce même utilisateur avec le même rôle
      Alors le profil de l'utilisateur devrait être créé avec toutes ces informations`, async () => {
    const utilisateurRepo = fakeTransactionalRepo({ statut: 'invité', role: 'cre' } as Utilisateur)
    const publishToEventStore = jest.fn()

    const créerProfilUtilisateur = makeCréerProfilUtilisateur({
      utilisateurRepo,
      publishToEventStore,
    })

    await créerProfilUtilisateur({
      email: 'utilisateur@email.com',
      nom: 'Nom',
      prénom: 'Prénom',
      fonction: 'Ma fonction',
    })

    expect(publishToEventStore).toHaveBeenCalledWith(
      expect.objectContaining({
        aggregateId: 'utilisateur@email.com',
        type: 'ProfilUtilisateurCréé',
        payload: {
          email: 'utilisateur@email.com',
          role: 'cre',
          nom: 'Nom',
          prénom: 'Prénom',
          fonction: 'Ma fonction',
        },
      })
    )
  })
})
