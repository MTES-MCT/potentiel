import { Readable } from 'stream'
import { okAsync } from '@core/utils'
import { DomainEvent, UniqueEntityID } from '@core/domain'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import {
  fakeRepo,
  fakeTransactionalRepo,
  makeFakeDemandeDélai,
} from '../../../../__tests__/fixtures/aggregates'
import { makeAccorderDemandeDélai } from './accorderDemandeDélai'
import { UserRole } from '@modules/users'
import { StatutDemandeDélai } from '../DemandeDélai'
import { User } from '@entities'

import makeFakeProject from '../../../../__tests__/fixtures/project'

import { AccorderDemandeDélaiError, AccorderDateAchèvementAntérieureDateThéoriqueError } from '.'

describe(`Accorder une demande de délai`, () => {
  const demandeDélaiId = 'id-demande'
  const fichierRéponse = {
    contents: Readable.from('test-content'),
    filename: 'fichier-réponse',
  }

  const publishToEventStore = jest.fn((event: DomainEvent) =>
    okAsync<null, InfraNotAvailableError>(null)
  )

  beforeEach(() => publishToEventStore.mockClear())

  describe(`Impossible d'accorder un délai si non Admin/DGEC/DREAL`, () => {
    describe(`Etant donné un utilisateur autre que Admin, DGEC ou DREAL`, () => {
      const rolesNePouvantPasAccorderUneDemandeDélai: UserRole[] = [
        'acheteur-obligé',
        'ademe',
        'porteur-projet',
      ]

      for (const role of rolesNePouvantPasAccorderUneDemandeDélai) {
        const user = { role } as User

        it(`
        Lorsqu'il accorde une demande de délai
        Alors une erreur UnauthorizedError devrait être retournée
        Et aucun évènement ne devrait être publié dans le store`, async () => {
          const demandeDélai = makeFakeDemandeDélai({ projetId: 'le-projet' })
          const accorderDemandéDélai = makeAccorderDemandeDélai({
            demandeDélaiRepo: { ...fakeTransactionalRepo(demandeDélai), ...fakeRepo(demandeDélai) },
            publishToEventStore,
            fileRepo: fakeRepo(),
            projectRepo: fakeRepo(),
          })

          const res = await accorderDemandéDélai({
            user,
            demandeDélaiId,
            dateAchèvementAccordée: new Date(),
            fichierRéponse,
          })

          expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
          expect(publishToEventStore).not.toHaveBeenCalled()
        })
      }
    })
  })

  describe(`Impossible d'accorder une demande avec un statut autre que 'envoyée'`, () => {
    describe(`Etant donné un utilisateur Admin, DGEC ou DREAL`, () => {
      const user = { role: 'admin' } as User

      const statutsNePouvantPasÊtreAccordé: StatutDemandeDélai[] = [
        'accordée',
        'refusée',
        'annulée',
      ]

      for (const statut of statutsNePouvantPasÊtreAccordé) {
        it(`
      Lorsqu'il accorde une demande de délai avec comme statut '${statut}'
      Alors une erreur ImpossibleDAccorderDemandeDélai devrait être retournée
      Et aucun évènement ne devrait être publié dans le store`, async () => {
          const fileRepo = fakeRepo()
          const projectRepo = fakeRepo(makeFakeProject())

          const demandeDélai = makeFakeDemandeDélai({
            id: demandeDélaiId,
            statut,
            projetId: 'le-projet',
          })
          const accorderDemandéDélai = makeAccorderDemandeDélai({
            demandeDélaiRepo: { ...fakeTransactionalRepo(demandeDélai), ...fakeRepo(demandeDélai) },
            publishToEventStore,
            fileRepo,
            projectRepo,
          })

          const res = await accorderDemandéDélai({
            user,
            demandeDélaiId,
            dateAchèvementAccordée: new Date(),
            fichierRéponse,
          })

          const erreurActuelle = res._unsafeUnwrapErr()
          expect(erreurActuelle).toBeInstanceOf(AccorderDemandeDélaiError)
          if (erreurActuelle instanceof AccorderDemandeDélaiError) {
            expect(erreurActuelle).toMatchObject(
              expect.objectContaining({
                demandeDélai: expect.objectContaining({
                  id: new UniqueEntityID(demandeDélaiId),
                  statut,
                }),
                raison: expect.any(String),
              })
            )
          }
          expect(publishToEventStore).not.toHaveBeenCalled()
          expect(fileRepo.save).not.toHaveBeenCalled()
        })
      }
    })
  })

  describe(`Impossible d'accorder une demande si la date limite d'achèvement souhaitée est antérieure à la date théorique d'achèvement`, () => {
    describe(`Etant donné un utilisateur Admin, DGEC ou DREAL`, () => {
      const user = { role: 'admin' } as User
      const fileRepo = fakeRepo()

      describe(`Lorsque la date limite d'achèvement souhaitée est antérieure à la date théorique d'achèvement`, () => {
        it(`Alors une erreur est retournée`, async () => {
          const projectRepo = fakeRepo(
            makeFakeProject({ completionDueOn: new Date('2022-01-01').getTime() })
          )

          const demandeDélai = makeFakeDemandeDélai({
            id: demandeDélaiId,
            statut: 'envoyée',
            projetId: 'le-projet',
          })

          const accorderDemandéDélai = makeAccorderDemandeDélai({
            demandeDélaiRepo: {
              ...fakeTransactionalRepo(demandeDélai),
              ...fakeRepo(demandeDélai),
            },
            publishToEventStore,
            fileRepo,
            projectRepo,
          })

          const resultat = await accorderDemandéDélai({
            user,
            demandeDélaiId,
            dateAchèvementAccordée: new Date('2021-01-01'),
            fichierRéponse,
          })

          const erreurActuelle = resultat._unsafeUnwrapErr()
          expect(erreurActuelle).toBeInstanceOf(AccorderDateAchèvementAntérieureDateThéoriqueError)
          expect(publishToEventStore).not.toHaveBeenCalled()
          expect(fileRepo.save).not.toHaveBeenCalled()
        })
      })
    })
  })

  describe(`Accorder un délai`, () => {
    describe(`Etant donné un utilisateur Admin, DGEC ou DREAL`, () => {
      const user = { role: 'admin' } as User

      const statutsPouvantÊtreAccordé: StatutDemandeDélai[] = ['envoyée', 'en-instruction']

      for (const statut of statutsPouvantÊtreAccordé) {
        it(`
      Lorsqu'il accorde une demande de délai avec comme statut '${statut}'
      Alors le courrier de réponse devrait être sauvegardé 
      Et l'évenement 'DélaiAccordé' devrait être publié dans le store`, async () => {
          const ancienneDateThéoriqueAchèvement = new Date('2022-06-27')
          const fileRepo = fakeRepo()
          const projectRepo = fakeRepo(
            makeFakeProject({ completionDueOn: ancienneDateThéoriqueAchèvement.getTime() })
          )

          const demandeDélai = makeFakeDemandeDélai({
            id: demandeDélaiId,
            statut,
            projetId: 'le-projet-de-la-demande',
          })

          const accorderDemandéDélai = makeAccorderDemandeDélai({
            demandeDélaiRepo: { ...fakeTransactionalRepo(demandeDélai), ...fakeRepo(demandeDélai) },
            publishToEventStore,
            fileRepo,
            projectRepo,
          })

          const resultat = await accorderDemandéDélai({
            user,
            demandeDélaiId,
            dateAchèvementAccordée: new Date('2023-06-27'),
            fichierRéponse,
          })

          expect(resultat.isOk()).toBe(true)
          expect(fileRepo.save).toHaveBeenCalledWith(
            expect.objectContaining({
              designation: 'modification-request-response',
              forProject: { value: 'le-projet-de-la-demande' },
              filename: fichierRéponse.filename,
              path: 'projects/le-projet-de-la-demande/fichier-réponse',
            })
          )
          expect(publishToEventStore).toHaveBeenCalledWith(
            expect.objectContaining({
              type: 'DélaiAccordé',
              payload: expect.objectContaining({
                ancienneDateThéoriqueAchèvement: ancienneDateThéoriqueAchèvement.toISOString(),
                dateAchèvementAccordée: new Date('2023-06-27').toISOString(),
                projetId: 'le-projet-de-la-demande',
                accordéPar: user.id,
                demandeDélaiId,
                fichierRéponseId: expect.any(String),
              }),
            })
          )
        })
      }
    })
  })
})
