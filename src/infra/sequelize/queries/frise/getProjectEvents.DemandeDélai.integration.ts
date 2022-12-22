import { User } from '@entities'
import { USER_ROLES } from '@modules/users'
import { UniqueEntityID } from '@core/domain'
import { ProjectEvent } from '../../projectionsNext/projectEvents/projectEvent.model'
import { getProjectEvents } from './getProjectEvents'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import models from '../../models'
import { resetDatabase } from '../../helpers'

describe(`getProjectEvents`, () => {
  const { Project } = models
  const projetId = new UniqueEntityID().toString()
  const projet = makeFakeProject({ id: projetId, potentielIdentifier: 'pot-id' })
  const demandeDélaiId = new UniqueEntityID().toString()
  const autreDemandeDélaiId = new UniqueEntityID().toString()
  const autreDemandeDélaiId2 = new UniqueEntityID().toString()
  const dateDemandée = new Date().getTime()
  const porteurId = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
    await Project.create(projet)
  })

  const délaiDemandéEvent = {
    id: demandeDélaiId,
    projectId: projetId,
    type: 'DemandeDélai',
    valueDate: new Date('2022-01-01').getTime(),
    eventPublishedAt: new Date('2022-01-01').getTime(),
    payload: {
      statut: 'envoyée',
      autorité: 'dreal',
      dateAchèvementDemandée: dateDemandée,
      demandeur: porteurId,
    },
  }

  const demandeDélaiAnnuléeEvent = {
    id: autreDemandeDélaiId,
    projectId: projetId,
    type: 'DemandeDélai',
    valueDate: new Date('2022-01-02').getTime(),
    eventPublishedAt: new Date('2022-01-02').getTime(),
    payload: {
      statut: 'annulée',
      annuléPar: porteurId,
      dateAchèvementDemandée: dateDemandée,
    },
  }

  const demandeDélaiRejetéeEvent = {
    id: autreDemandeDélaiId2,
    projectId: projetId,
    type: 'DemandeDélai',
    valueDate: new Date('2022-01-03').getTime(),
    eventPublishedAt: new Date('2022-01-03').getTime(),
    payload: {
      statut: 'rejetée',
      annuléPar: porteurId,
      dateAchèvementDemandée: dateDemandée,
    },
  }

  const rolesAutorisés = [
    'admin',
    'porteur-projet',
    'dreal',
    'acheteur-obligé',
    'dgec-validateur',
    'caisse-des-dépôts',
  ]

  describe(`Utilisateur ayant les droits pour visualiser les demandes de délai`, () => {
    for (const role of rolesAutorisés) {
      const user = { role } as User
      it(`Etant donné un utilisateur '${role}',
          alors les événements de type "DemandeDélai" devraient être retournés`, async () => {
        await ProjectEvent.bulkCreate([
          délaiDemandéEvent,
          demandeDélaiAnnuléeEvent,
          demandeDélaiRejetéeEvent,
        ])
        const result = await getProjectEvents({ projectId: projetId, user })

        expect(result._unsafeUnwrap()).toMatchObject({
          events: [
            {
              type: 'DemandeDélai',
              variant: user.role,
              date: délaiDemandéEvent.valueDate,
              statut: 'envoyée',
              dateAchèvementDemandée: dateDemandée,
            },
            {
              type: 'DemandeDélai',
              variant: user.role,
              date: demandeDélaiAnnuléeEvent.valueDate,
              statut: 'annulée',
            },
            {
              type: 'DemandeDélai',
              variant: user.role,
              date: demandeDélaiRejetéeEvent.valueDate,
              dateAchèvementDemandée: dateDemandée,
              statut: 'rejetée',
            },
          ],
        })
      })
    }
  })
  describe(`Utilisateur n'ayant pas les droits pour visualiser les demandes de délai`, () => {
    for (const role of USER_ROLES.filter((role) => !rolesAutorisés.includes(role))) {
      const user = { role } as User
      it(`Etant donné un utilisateur '${role}',
        alors les événements de type "DemandeDélai" ne devraient pas être retournés`, async () => {
        await ProjectEvent.bulkCreate([
          délaiDemandéEvent,
          demandeDélaiAnnuléeEvent,
          demandeDélaiRejetéeEvent,
        ])

        const result = await getProjectEvents({ projectId: projetId, user })

        expect(result._unsafeUnwrap()).toMatchObject({
          events: [],
        })
      })
    }
  })
})
