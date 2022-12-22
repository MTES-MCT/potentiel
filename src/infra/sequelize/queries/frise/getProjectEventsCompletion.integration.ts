import { getProjectEvents } from '.'
import { resetDatabase } from '../../helpers'
import { ProjectEvent } from '../../projectionsNext'
import { UniqueEntityID } from '@core/domain'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import { models } from '../../models'
import { USER_ROLES } from '@modules/users'
import { User } from '@entities'
import { ProjectCompletionDueDateSetEvent } from '@infra/sequelize/projectionsNext/projectEvents/events'

describe('getProjectEvents pour les événements ProjectCompletionDueDateSet', () => {
  const { Project } = models
  const projetId = new UniqueEntityID().toString()
  const projet = makeFakeProject({ id: projetId, potentielIdentifier: 'pot-id' })
  const valueDate = new Date('2024-01-01').getTime()
  const eventPublishedAt = new Date('2022-01-01').getTime()

  beforeEach(async () => {
    await resetDatabase()
    await Project.create(projet)
  })

  const projectCompletionDueDateSetEvent = {
    id: new UniqueEntityID().toString(),
    type: 'ProjectCompletionDueDateSet',
    valueDate,
    eventPublishedAt,
    projectId: projetId,
  } as ProjectCompletionDueDateSetEvent

  const rolesAutorisés = [
    'admin',
    'porteur-projet',
    'dreal',
    'acheteur-obligé',
    'dgec-validateur',
    'cre',
    'caisse-des-dépôts',
  ]

  describe(`Utilisateurs autorisés à visualiser la date d'achèvement des projets`, () => {
    for (const role of rolesAutorisés) {
      it(`Etant donné un utilisateur ${role},
        alors les événements ProjectCompletionDueDateSet devraient être retournés`, async () => {
        const utilisateur = { role } as User
        await ProjectEvent.create(projectCompletionDueDateSetEvent)
        const result = await getProjectEvents({ projectId: projetId, user: utilisateur })
        expect(result._unsafeUnwrap()).toMatchObject({
          events: [{ type: 'ProjectCompletionDueDateSet', date: valueDate, variant: role }],
        })
      })
    }
  })

  describe(`Utilisateurs non-autorisés à visualiser la date d'achèvement des projets`, () => {
    for (const role of USER_ROLES.filter((role) => !rolesAutorisés.includes(role))) {
      it(`Etant donné un utilisateur ${role},
        alors les événements ProjectCompletionDueDateSet ne devraient pas être retournés`, async () => {
        const utilisateur = { role } as User
        await ProjectEvent.create(projectCompletionDueDateSetEvent)
        const result = await getProjectEvents({ projectId: projetId, user: utilisateur })
        expect(result._unsafeUnwrap()).toMatchObject({
          events: [],
        })
      })
    }
  })
})
