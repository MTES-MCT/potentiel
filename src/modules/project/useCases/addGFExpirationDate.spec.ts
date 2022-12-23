import { DomainEvent, UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { makeUser } from '@entities'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { UnwrapForTest } from '../../../types'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { makeAddGFExpirationDate } from './addGFExpirationDate'
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import { Project } from '../Project'
import { USER_ROLES } from '@modules/users'

const projectId = new UniqueEntityID().toString()

const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null))

const fakeProject = makeFakeProject()

const projectRepo = fakeTransactionalRepo(fakeProject as Project)

describe(`Ajouter une date d'expiration à une garantie financière`, () => {
  beforeEach(() => {
    return fakePublish.mockClear()
  })
  describe("Ajout impossible si l'utilisateur n'a pas les droits sur le projet", () => {
    const rolesNonAutorisés = USER_ROLES.filter(
      (u) =>
        !['dreal', 'porteur-projet', 'caisse-des-dépôts', 'admin', 'dgec-validateur'].includes(u)
    )

    for (const role of rolesNonAutorisés) {
      it(`Étant donné un utilisateur ayant le role ${role}
          Lorsqu'il ajoute une date d'expiration à une garantie financière
          Alors une erreur UnauthorizedError devrait être retournée`, async () => {
        const user = UnwrapForTest(makeUser(makeFakeUser({ role })))
        const shouldUserAccessProject = jest.fn(async () => false)
        const addGFExpirationDate = makeAddGFExpirationDate({
          shouldUserAccessProject,
          projectRepo,
        })

        const res = await addGFExpirationDate({
          projectId,
          submittedBy: user,
          expirationDate: new Date('2022-05-16'),
        })

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)

        expect(fakePublish).not.toHaveBeenCalled()
      })
    }
  })

  describe("Suppression possible si l'utilisateur a les droits sur le projet", () => {
    const rolesAutorisés = USER_ROLES.filter((u) =>
      ['dreal', 'porteur-projet', 'caisse-des-dépôts', 'admin', 'dgec-validateur'].includes(u)
    )

    for (const role of rolesAutorisés) {
      it(`Étant donné un utilisateur ayant le role ${role}
          Lorsqu'il ajoute une date d'expiration à une garantie financière
          Alors la date d'expiration devrait être ajouté à garantie financière`, async () => {
        const user = UnwrapForTest(makeUser(makeFakeUser({ role })))
        const shouldUserAccessProject = jest.fn(async () => true)

        const addGFExpirationDate = makeAddGFExpirationDate({
          shouldUserAccessProject,
          projectRepo,
        })

        const res = await addGFExpirationDate({
          projectId,
          submittedBy: user,
          expirationDate: new Date('2022-05-16'),
        })

        expect(res.isOk()).toBe(true)
        expect(fakeProject.addGFExpirationDate).toHaveBeenCalled()
        expect(fakeProject.addGFExpirationDate).toHaveBeenCalledWith({
          projectId,
          submittedBy: user,
          expirationDate: new Date('2022-05-16'),
        })
      })
    }
  })
})
