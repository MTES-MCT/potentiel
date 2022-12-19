import { User } from '@entities'
import { UniqueEntityID } from '@core/domain'
import { USER_ROLES } from '@modules/users'
import { getProjectEvents } from '.'
import { ProjectEvent } from '../../projectionsNext'
import { resetDatabase } from '../../helpers'
import { models } from '../../models'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import { DemandeSignaledEvents } from '@infra/sequelize/projectionsNext/projectEvents/events'

describe('getProjectEvents pour les événements DemandeDelaiSignaled', () => {
  const { Project } = models
  const projetId = new UniqueEntityID().toString()
  const projet = makeFakeProject({ id: projetId, potentielIdentifier: 'pot-id' })

  beforeEach(async () => {
    await resetDatabase()
    await Project.create(projet)
  })

  const DemandeDelaiSignaledEvent = {
    id: new UniqueEntityID().toString(),
    projectId: projetId,
    type: 'DemandeDelaiSignaled',
    valueDate: new Date('2022-02-09').getTime(),
    eventPublishedAt: new Date('2022-02-09').getTime(),
    payload: {
      signaledBy: 'user-id',
      status: 'acceptée',
      oldCompletionDueOn: new Date('2024-09-31').getTime(),
      newCompletionDueOn: new Date('2025-01-31').getTime(),
      attachment: { id: 'file-id', name: 'file-name' },
      notes: 'notes',
    },
  } as DemandeSignaledEvents

  describe(`Utilisateurs autorisés à visualiser les demandes de délai faites hors Potentiel et ajoutées aux projets`, () => {
    for (const role of ['admin', 'porteur-projet', 'dreal', 'acheteur-obligé', 'dgec-validateur']) {
      const utilisateur = { role } as User

      it(`Etant donné un utilisateur ${role},
      alors les événements DemandeDelaiSignaled devraient être retournés`, async () => {
        await ProjectEvent.create(DemandeDelaiSignaledEvent)

        const result = await getProjectEvents({ projectId: projetId, user: utilisateur })

        expect(result._unsafeUnwrap()).toMatchObject({
          events: expect.arrayContaining([
            {
              type: 'DemandeDelaiSignaled',
              variant: role,
              date: new Date('2022-02-09').getTime(),
              signaledBy: 'user-id',
              status: 'acceptée',
              oldCompletionDueOn: new Date('2024-09-31').getTime(),
              newCompletionDueOn: new Date('2025-01-31').getTime(),
              attachment: { id: 'file-id', name: 'file-name' },
              ...(['admin', 'dgec-validateur', 'dreal'].includes(role) && { notes: 'notes' }),
            },
          ]),
        })
      })
    }
  })

  describe(`Utilisateurs non-autorisés à visualiser les demandes de délai faites hors Potentiel et ajoutées aux projets`, () => {
    for (const role of USER_ROLES.filter(
      (role) =>
        !['admin', 'porteur-projet', 'dreal', 'acheteur-obligé', 'dgec-validateur'].includes(role)
    )) {
      const utilisateur = { role } as User

      it(`Etant donné un utilisateur ${role},
      alors les événements DemandeDelaiSignaled ne devraient pas être retournés`, async () => {
        await ProjectEvent.create(DemandeDelaiSignaledEvent)

        const result = await getProjectEvents({ projectId: projetId, user: utilisateur })

        expect(result._unsafeUnwrap()).toMatchObject({
          events: expect.arrayContaining([]),
        })
      })
    }
  })
})
