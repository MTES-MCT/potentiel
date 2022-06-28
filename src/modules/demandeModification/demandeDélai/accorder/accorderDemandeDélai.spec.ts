import { Readable } from 'stream'
import { okAsync } from '@core/utils'
import { DomainEvent, UniqueEntityID } from '@core/domain'
import { InfraNotAvailableError } from '@modules/shared'
import { fakeRepo, fakeTransactionalRepo } from '../../../../__tests__/fixtures/aggregates'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { UnauthorizedError } from '../../../shared'
import { construireAccorderDemandeDélai } from './accorderDemandeDélai'
import { UserRole } from 'src/modules/users'
import { DemandeDélai, StatutDemandeDélai } from '../DemandeDélai'
import { User } from '@entities'
import { ImpossibleDAccorderDemandeDélai } from './ImpossibleDAccorderDemandeDélai'

describe(`Accorder une demande de délai`, () => {
  const demandeDélaiId = new UniqueEntityID('id-demande')
  const demandeDélai: DemandeDélai = {
    id: demandeDélaiId,
    pendingEvents: [],
    statut: undefined,
    projet: undefined,
  }
  const fichierRéponse = {
    contents: Readable.from('test-content'),
    filename: 'fichier-réponse',
  }

  const publishToEventStore = jest.fn((event: DomainEvent) =>
    okAsync<null, InfraNotAvailableError>(null)
  )

  describe(`Impossible d'accorder un délai si non Admin/DGEC/DREAL`, () => {
    describe(`Etant donné un utilisateur autre que Admin, DGEC ou DREAL`, () => {
      const rolesNePouvantPasAccorderUneDemandeDélai: UserRole[] = [
        'acheteur-obligé',
        'ademe',
        'porteur-projet',
      ]

      for (const role of rolesNePouvantPasAccorderUneDemandeDélai) {
        const user = makeFakeUser({ role })

        it(`
        Lorsqu'il accorde une demande de délai
        Alors une erreur UnauthorizedError devrait être retournée
        Et aucun évènement ne devrait être publié dans le store`, async () => {
          publishToEventStore.mockClear()

          const accorderDemandéDélai = construireAccorderDemandeDélai({
            demandeDélaiRepo: fakeTransactionalRepo(demandeDélai),
            publishToEventStore,
            fileRepo: fakeRepo(),
          })

          const res = await accorderDemandéDélai({
            user,
            demandeDélaiId: demandeDélaiId.toString(),
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

      const statutsNePouvantPasÊtreAccordé = [
        'accordée',
        'rejetée',
        'annulée',
      ] as StatutDemandeDélai[]

      for (const statut of statutsNePouvantPasÊtreAccordé) {
        it(`
      Lorsqu'il accorde une demande de délai avec comme statut '${statut}'
      Alors une erreur ImpossibleDAccorderDemandeDélai devrait être retournée
      Et aucun évènement ne devrait être publié dans le store`, async () => {
          publishToEventStore.mockClear()

          const accorderDemandéDélai = construireAccorderDemandeDélai({
            demandeDélaiRepo: fakeTransactionalRepo({ ...demandeDélai, statut } as DemandeDélai),
            publishToEventStore,
            fileRepo: fakeRepo(),
          })

          const res = await accorderDemandéDélai({
            user,
            demandeDélaiId: demandeDélai.id.toString(),
            dateAchèvementAccordée: new Date(),
            fichierRéponse,
          })

          const erreurActuelle = res._unsafeUnwrapErr()
          expect(erreurActuelle).toBeInstanceOf(ImpossibleDAccorderDemandeDélai)
          if (erreurActuelle instanceof ImpossibleDAccorderDemandeDélai) {
            expect(erreurActuelle.demandeDélai).toMatchObject({ ...demandeDélai, statut })
          }
          expect(publishToEventStore).not.toHaveBeenCalled()
        })
      }
    })
  })

  describe(`Accorder une demande`, () => {
    describe(`Etant donné un utilisateur Admin, DGEC ou DREAL`, () => {
      const user = { role: 'admin' } as User
      it(`
      Lorsqu'il accorde une demande de délai avec comme statut 'envoyée'
      Alors le courrier de réponse devrait être sauvegardé 
      Et l'évenement 'DélaiAccordé' devrait être publié dans le store`, async () => {
        const fileRepo = fakeRepo()
        publishToEventStore.mockClear()

        const accorderDemandéDélai = construireAccorderDemandeDélai({
          demandeDélaiRepo: fakeTransactionalRepo({
            ...demandeDélai,
            statut: 'envoyée',
            projet: { id: new UniqueEntityID('le-projet-de-la-demande') },
          } as DemandeDélai),
          publishToEventStore,
          fileRepo,
        })

        const res = await accorderDemandéDélai({
          user,
          demandeDélaiId: demandeDélaiId.toString(),
          dateAchèvementAccordée: new Date('2022-06-27'),
          fichierRéponse,
        })

        expect(res.isOk()).toBe(true)
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
              dateAchèvementAccordée: new Date('2022-06-27'),
              accordéPar: user.id,
              demandeDélaiId: demandeDélaiId.toString(),
              fichierRéponseId: expect.any(String),
            }),
          })
        )
      })
    })
  })
})
