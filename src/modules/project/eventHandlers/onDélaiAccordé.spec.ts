import { fakeTransactionalRepo } from '../../../__tests__/fixtures/aggregates'
import makeFakeProject from '../../../__tests__/fixtures/project'
import { makeOnDélaiAccordé } from './onDélaiAccordé'
import { DomainEvent } from '@core/domain'
import { InfraNotAvailableError } from '@modules/shared'
import { okAsync } from '@core/utils'
import { DélaiAccordé } from '@modules/demandeModification'

describe(`Mettre à jour la date d'achèvement lorsque un délai est accordé`, () => {
  it(`Lorsqu'un délai est accordé pour un projet
        Alors la date d'achèvement du projet devrait être mise jour avec la date d'achèvement accordée`, async () => {
    const publishToEventStore = jest.fn((event: DomainEvent) =>
      okAsync<null, InfraNotAvailableError>(null)
    )

    const onDélaiAccordé = makeOnDélaiAccordé({
      projectRepo: fakeTransactionalRepo(makeFakeProject({ id: 'le-projet' })),
      publishToEventStore,
    })

    const résultat = await onDélaiAccordé(
      new DélaiAccordé({
        payload: {
          accordéPar: 'admin',
          demandeDélaiId: 'la-demande',
          projetId: 'le-projet',
          dateAchèvementAccordée: new Date('2025-06-30').toISOString(),
        },
      })
    )

    expect(résultat.isOk()).toBe(true)
    expect(publishToEventStore).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'ProjectCompletionDueDateSet',
        payload: expect.objectContaining({
          projectId: 'le-projet',
          setBy: 'admin',
          completionDueOn: new Date('2025-06-30').getTime(),
        }),
      })
    )
  })
})
