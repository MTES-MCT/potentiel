import { User } from '@entities'
import { UniqueEntityID } from '@core/domain'
import { USER_ROLES } from '@modules/users'
import { getProjectEvents } from '.'
import { ProjectEvent } from '../../projectionsNext'
import { resetDatabase } from '../../helpers'
import { models } from '../../models'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import { ModificationRequestEvents } from '@infra/sequelize/projectionsNext/projectEvents/events'

describe('getProjectEvents for ModificationReceived events', () => {
  const { Project } = models
  const projectId = new UniqueEntityID().toString()
  const fakeProject = makeFakeProject({
    id: projectId,
    potentielIdentifier: 'pot-id',
  })
  const date = new Date()

  beforeEach(async () => {
    await resetDatabase()
    await Project.create(fakeProject)
  })

  // événements à tester

  const producteurModificationReceivedEvent = {
    id: new UniqueEntityID().toString(),
    projectId,
    type: 'ModificationReceived',
    valueDate: date.getTime(),
    eventPublishedAt: date.getTime(),
    payload: {
      modificationType: 'producteur',
      producteur: 'nom producteur',
      modificationRequestId: 'id',
    },
  } as ModificationRequestEvents

  const actionnaireModificationReceivedEvent = {
    id: new UniqueEntityID().toString(),
    projectId,
    type: 'ModificationReceived',
    valueDate: date.getTime(),
    eventPublishedAt: date.getTime(),
    payload: {
      modificationType: 'actionnaire',
      actionnaire: 'nom actionnaire',
      modificationRequestId: 'id',
    },
  } as ModificationRequestEvents

  const fournisseurModificationReceivedEvent = {
    id: new UniqueEntityID().toString(),
    projectId,
    type: 'ModificationReceived',
    valueDate: date.getTime(),
    eventPublishedAt: date.getTime(),
    payload: {
      modificationType: 'fournisseur',
      fournisseurs: [
        { kind: 'Nom du fabricant \n(Modules ou films)', name: 'name1' },
        { kind: 'Nom du fabricant \n(Polysilicium)', name: 'name2' },
      ],
      modificationRequestId: 'id',
    },
  } as ModificationRequestEvents

  const puissanceModificationReceivedEvent = {
    id: new UniqueEntityID().toString(),
    projectId,
    type: 'ModificationReceived',
    valueDate: date.getTime(),
    eventPublishedAt: date.getTime(),
    payload: {
      modificationType: 'puissance',
      puissance: 2,
      modificationRequestId: 'id',
    },
  } as ModificationRequestEvents

  const rolesAutorisés = ['admin', 'porteur-projet', 'dreal', 'acheteur-obligé', 'dgec-validateur']

  describe(`Utilisateurs autorisés à visualiser les informations de modification de projet`, () => {
    for (const role of rolesAutorisés) {
      it(`Etant donné un utlisateur ${role},
      alors les événements de type ModificationReceived devraient être retournés`, async () => {
        const utlisateur = { role } as User

        await ProjectEvent.bulkCreate([
          producteurModificationReceivedEvent,
          actionnaireModificationReceivedEvent,
          fournisseurModificationReceivedEvent,
          puissanceModificationReceivedEvent,
        ])

        const result = await getProjectEvents({ projectId, user: utlisateur })
        expect(result._unsafeUnwrap()).toMatchObject({
          events: [
            {
              type: 'ModificationReceived',
              date: date.getTime(),
              variant: role,
              modificationType: 'producteur',
              producteur: 'nom producteur',
              modificationRequestId: 'id',
            },
            {
              type: 'ModificationReceived',
              date: date.getTime(),
              variant: role,
              modificationType: 'actionnaire',
              actionnaire: 'nom actionnaire',
              modificationRequestId: 'id',
            },
            {
              type: 'ModificationReceived',
              date: date.getTime(),
              variant: role,
              modificationType: 'fournisseur',
              fournisseurs: [
                { kind: 'Nom du fabricant \n(Modules ou films)', name: 'name1' },
                { kind: 'Nom du fabricant \n(Polysilicium)', name: 'name2' },
              ],
              modificationRequestId: 'id',
            },
            {
              type: 'ModificationReceived',
              date: date.getTime(),
              variant: role,
              modificationType: 'puissance',
              puissance: 2,
              unitePuissance: 'MWc', // unitePuissance for Fessenheim AO
              modificationRequestId: 'id',
            },
          ],
        })
      })
    }
  })

  describe(`Utilisateurs non-autorisés à visualiser les informations de modification de projet`, () => {
    for (const role of USER_ROLES.filter((role) => !rolesAutorisés.includes(role))) {
      it(`Etant donné un utlisateur ${role},
      alors les événements de type ModificationReceived ne devraient pas être retournés`, async () => {
        const utlisateur = { role } as User

        await ProjectEvent.bulkCreate([
          producteurModificationReceivedEvent,
          actionnaireModificationReceivedEvent,
          fournisseurModificationReceivedEvent,
          puissanceModificationReceivedEvent,
        ])

        const result = await getProjectEvents({ projectId, user: utlisateur })
        expect(result._unsafeUnwrap()).toMatchObject({
          events: [],
        })
      })
    }
  })
})
