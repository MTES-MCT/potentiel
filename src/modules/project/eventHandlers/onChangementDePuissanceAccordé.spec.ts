import { DomainEvent, UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { InfraNotAvailableError } from '@modules/shared'
import { makeOnChangementDePuissanceAccordé } from './onChangementDePuissanceAccordé'

import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import { ChangementDePuissanceAccordé } from '@modules/demandeModification'
import { Project } from '../Project'

describe(`Possible de mettre à jour la puissance d'un projet lorsqu'une demande de changement de puissance est accordée`, () => {
  it(`Lorsqu'une demande de changement de puissance est accordée pour un projet
        Alors la puissance du projet devrait être mise jour avec la nouvelle valeur accordée`, async () => {
    const publishToEventStore = jest.fn((event: DomainEvent) =>
      okAsync<null, InfraNotAvailableError>(null)
    )

    const nouvellePuissance = 11
    const fakeProject = {
      ...makeFakeProject(),
      id: new UniqueEntityID('projet-id'),
      puissanceInitiale: 10,
    } as Project

    const onChangementDePuissanceAccordé = makeOnChangementDePuissanceAccordé({
      projectRepo: fakeTransactionalRepo(fakeProject),
      publishToEventStore,
    })

    const résultat = await onChangementDePuissanceAccordé(
      new ChangementDePuissanceAccordé({
        payload: {
          accordéPar: 'admin',
          demandeId: 'la-demande',
          projetId: 'le-projet',
          nouvellePuissance,
          isDecisionJustice: true,
        },
      })
    )

    expect(résultat.isOk()).toBe(true)
    expect(publishToEventStore).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'ProjectPuissanceUpdated',
        payload: expect.objectContaining({
          projectId: 'le-projet',
          updatedBy: 'admin',
          newPuissance: nouvellePuissance,
        }),
      })
    )
  })
})
