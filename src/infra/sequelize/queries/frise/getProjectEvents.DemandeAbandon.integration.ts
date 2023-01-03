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
  const projectId = new UniqueEntityID().toString()
  const projet = makeFakeProject({ id: projectId, potentielIdentifier: 'pot-id' })
  const demandeAbandonEnvoyéeId = new UniqueEntityID().toString()
  const demandeAbandonAnnuléeId = new UniqueEntityID().toString()
  const demandeAbandonRejetéeId = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
    await Project.create(projet)
  })

  const demandeAbandonEnvoyéeÉvènement = {
    id: demandeAbandonEnvoyéeId,
    projectId,
    type: 'DemandeAbandon',
    valueDate: new Date('2022-01-01').getTime(),
    eventPublishedAt: new Date('2022-01-01').getTime(),
    payload: {
      autorité: 'dgec',
      statut: 'envoyée',
    },
  }

  const demandeAbandonAnnuléeÉvènement = {
    id: demandeAbandonAnnuléeId,
    projectId,
    type: 'DemandeAbandon',
    valueDate: new Date('2022-01-01').getTime(),
    eventPublishedAt: new Date('2022-01-01').getTime(),
    payload: {
      autorité: 'dgec',
      statut: 'annulée',
    },
  }

  const demandeAbandonRejetéeÉvènement = {
    id: demandeAbandonRejetéeId,
    projectId,
    type: 'DemandeAbandon',
    valueDate: new Date('2022-01-01').getTime(),
    eventPublishedAt: new Date('2022-01-01').getTime(),
    payload: {
      autorité: 'dgec',
      statut: 'rejetée',
    },
  }

  const rolesAutorisés = [
    'admin',
    'porteur-projet',
    'dreal',
    'acheteur-obligé',
    'dgec-validateur',
    'caisse-des-dépôts',
    'cre',
  ]

  describe(`Utilisateur n'ayant pas les droits pour visualiser les demandes d'abandon`, () => {
    for (const role of USER_ROLES.filter((role) => !rolesAutorisés.includes(role))) {
      const user = { role } as User
      it(`Etant donné un utilisateur '${role}',
        alors les événements de type "DemandeAbandon" ne devraient pas être retournés`, async () => {
        await ProjectEvent.bulkCreate([
          demandeAbandonEnvoyéeÉvènement,
          demandeAbandonAnnuléeÉvènement,
          demandeAbandonRejetéeÉvènement,
        ])

        const result = await getProjectEvents({ projectId, user })

        expect(result._unsafeUnwrap()).toMatchObject({
          events: [],
        })
      })
    }
  })

  describe(`Utilisateur ayant les droits pour visualiser les demandes d'abandon`, () => {
    for (const role of rolesAutorisés) {
      const user = { role } as User
      it(`Etant donné un utilisateur '${role}',
          alors les événements de type "DemandeAbandon" devraient être retournés`, async () => {
        await ProjectEvent.bulkCreate([
          demandeAbandonEnvoyéeÉvènement,
          demandeAbandonAnnuléeÉvènement,
          demandeAbandonRejetéeÉvènement,
        ])
        const result = await getProjectEvents({ projectId, user })

        expect(result._unsafeUnwrap()).toMatchObject({
          events: [
            {
              type: 'DemandeAbandon',
              variant: user.role,
              date: demandeAbandonEnvoyéeÉvènement.valueDate,
              statut: 'envoyée',
            },
            {
              type: 'DemandeAbandon',
              variant: user.role,
              date: demandeAbandonAnnuléeÉvènement.valueDate,
              statut: 'annulée',
            },
            {
              type: 'DemandeAbandon',
              variant: user.role,
              date: demandeAbandonRejetéeÉvènement.valueDate,
              statut: 'rejetée',
            },
          ],
        })
      })
    }
  })
})
