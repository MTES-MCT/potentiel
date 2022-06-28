import { User } from '@entities'
import { USER_ROLES } from '@modules/users'
import { UniqueEntityID } from '@core/domain'
import { ProjectEvent } from '../../projectionsNext'
import { getProjectEvents } from './getProjectEvents'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import models from '../../models'
import { resetDatabase } from '../../helpers'

describe(`getProjectEvents`, () => {
  const { Project } = models
  const projetId = new UniqueEntityID().toString()
  const fakeProject = makeFakeProject({ id: projetId, potentielIdentifier: 'pot-id' })

  beforeEach(async () => {
    await resetDatabase()
    await Project.create(fakeProject)
  })

  describe(`Lorsqu'il y a des événements de type "DemandeDélai" dans la projection ProjectEvents`, () => {
    const demandeDélaiId = new UniqueEntityID().toString()
    const autreDemandeDélaiId = new UniqueEntityID().toString()
    const date = new Date().getTime()
    const dateDemandée = new Date().getTime()
    const porteurId = new UniqueEntityID().toString()

    describe(`Lorsque l'utilisateur qui n'est pas ADEME`, () => {
      for (const role of USER_ROLES.filter((role) => role !== 'ademe')) {
        describe(`Etant donné un utilisateur ${role}`, () => {
          const user = { role } as User

          it(`Alors les événements de type "DemandeDélai" devraient être retournés`, async () => {
            await ProjectEvent.create({
              id: demandeDélaiId,
              projectId: projetId,
              type: 'DemandeDélai',
              valueDate: date,
              eventPublishedAt: date,
              payload: {
                statut: 'envoyée',
                autorité: 'dreal',
                dateAchèvementDemandée: dateDemandée,
                demandeur: porteurId,
              },
            })

            await ProjectEvent.create({
              id: autreDemandeDélaiId,
              projectId: projetId,
              type: 'DemandeDélai',
              valueDate: date,
              eventPublishedAt: date,
              payload: {
                statut: 'annulée',
                annuléPar: porteurId,
              },
            })

            const result = await getProjectEvents({ projectId: projetId, user })

            expect(result._unsafeUnwrap()).toMatchObject({
              events: [
                {
                  type: 'DemandeDélai',
                  variant: user.role,
                  date,
                  statut: 'envoyée',
                  dateAchèvementDemandée: dateDemandée,
                },
                {
                  type: 'DemandeDélai',
                  variant: user.role,
                  date,
                  statut: 'annulée',
                },
              ],
            })
          })
        })
      }
    })
    describe(`Lorsque l'utilisateur est ADEME`, () => {
      const user = { role: 'ademe' } as User
      it(`Alors les événements de type "DemandeDélai" ne devraient pas être retournés`, async () => {
        await ProjectEvent.create({
          id: demandeDélaiId,
          projectId: projetId,
          type: 'DemandeDélai',
          valueDate: date,
          eventPublishedAt: date,
          payload: {
            statut: 'envoyée',
            autorité: 'dreal',
            dateAchèvementDemandée: dateDemandée,
            demandeur: porteurId,
          },
        })

        const result = await getProjectEvents({ projectId: projetId, user })

        expect(result._unsafeUnwrap()).toMatchObject({
          events: [],
        })
      })
    })
  })
})
