import { UniqueEntityID } from '@core/domain'
import { USER_ROLES } from '@modules/users'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { fakeRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import { Project } from '../Project'
import { makeAjouterDateDeMiseEnService } from './ajouterDateDeMiseEnService'
import { User } from '@entities'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { okAsync } from '@core/utils'

describe(`Commmande ajouterDateDeMiseEnService`, () => {
  const nouvelleDateDeMiseEnService = new Date('2022-01-01').toISOString()
  const projetId = new UniqueEntityID()
  const project = makeFakeProject()
  const projectRepo = fakeRepo({ ...project, id: projetId } as Project)
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))
  beforeEach(() => {
    publishToEventStore.mockClear()
  })
  describe(`Erreur si l'utilisateur n'est pas admin ou dgec-validateur`, () => {
    for (const role of USER_ROLES.filter((role) => !['admin', 'dgec-validateur'].includes(role))) {
      it(`Si l'utilisateur a le rôle "${role}",
        alors une erreur UnauthorizedError devrait être retournée`, async () => {
        const utilisateur = makeFakeUser({ role }) as User
        const ajouterDateDeMiseEnService = makeAjouterDateDeMiseEnService({
          projectRepo,
          publishToEventStore,
        })
        const result = await ajouterDateDeMiseEnService({
          utilisateur,
          nouvelleDateDeMiseEnService,
          projetId: projetId.toString(),
        })
        expect(result.isErr()).toEqual(true)
        if (result.isOk()) return
        expect(result.error).toBeInstanceOf(UnauthorizedError)
      })
    }
  })

  describe(`Mise à jour d'un projet qui n'a pas de date de mise en service`, () => {
    it(`Etant donné un projet sans date de mise en service,
      lorsque que la commande est appelée avec une date de mise en service,
      alors un événement de type DateDeMiseEnServiceAjoutée devrait être émis`, async () => {
      const utilisateur = makeFakeUser({ role: 'admin', id: 'utilisateur-id' }) as User
      const projetId = new UniqueEntityID()
      const project = makeFakeProject()
      const projectRepo = fakeRepo({ ...project, id: projetId } as Project)

      const ajouterDateDeMiseEnService = makeAjouterDateDeMiseEnService({
        projectRepo,
        publishToEventStore,
      })
      await ajouterDateDeMiseEnService({
        utilisateur,
        nouvelleDateDeMiseEnService,
        projetId: projetId.toString(),
      })
      expect(publishToEventStore).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'DateDeMiseEnServiceAjoutée',
          payload: expect.objectContaining({
            projetId: projetId.toString(),
            nouvelleDateDeMiseEnService,
            utilisateurId: utilisateur.id,
          }),
        })
      )
    })
  })

  describe(`Ne rien faire si le projet a déjà une date de mise en service égale à la date importée`, () => {
    it(`Etant donné un projet ayant une date de mise en service T,
      lorsque que la commande est appelée avec une nouvelle date de mise en service égale à T,
      alors, aucun événement ne devrait être émis`, async () => {
      const utilisateur = makeFakeUser({ role: 'admin' }) as User
      const projetId = new UniqueEntityID()
      const project = makeFakeProject()
      const projectRepo = fakeRepo({
        ...project,
        id: projetId,
        dateDeMiseEnService: nouvelleDateDeMiseEnService,
      } as Project)

      const ajouterDateDeMiseEnService = makeAjouterDateDeMiseEnService({
        projectRepo,
        publishToEventStore,
      })
      await ajouterDateDeMiseEnService({
        utilisateur,
        nouvelleDateDeMiseEnService,
        projetId: projetId.toString(),
      })
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })
})
