import { DomainEvent } from '@core/domain'
import { okAsync } from '@core/utils'
import { AccordDemandeDélaiAnnulé } from '@modules/demandeModification'
import { InfraNotAvailableError } from '@modules/shared'
import { fakeTransactionalRepo } from '../../../__tests__/fixtures/aggregates'
import makeFakeProject from '../../../__tests__/fixtures/project'
import { makeOnAccordDemandeDélaiAnnulé } from './onAccordDemandeDélaiAnnulé'

describe(`Mettre à jour la date d'achèvement lorsque un délai accordé est annulé`, () => {
  it(`Lorsqu'un événement AccordDemandeDélaiAnnulé est émis
        alors un événement ProjectComplectionDuDateSet devrait être émis`, async () => {
    const publishToEventStore = jest.fn((event: DomainEvent) =>
      okAsync<null, InfraNotAvailableError>(null)
    )

    const onAccordDemandeDélaiAnnulé = makeOnAccordDemandeDélaiAnnulé({
      projectRepo: fakeTransactionalRepo(makeFakeProject({ id: 'le-projet' })),
      publishToEventStore,
    })

    const résultat = await onAccordDemandeDélaiAnnulé(
      new AccordDemandeDélaiAnnulé({
        payload: {
          annuléPar: 'admin',
          demandeDélaiId: 'la-demande',
          projetId: 'le-projet',
          nouvelleDateAchèvement: new Date('2025-06-30').toISOString(),
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
