import { resetDatabase } from '../../../helpers'
import { UniqueEntityID } from '@core/domain'
import { ModificationRequestInstructionStarted } from '@modules/modificationRequest'
import { ProjectEvent } from '..'
import models from '../../../models'
import onModificationRequestInstructionStarted from './onModificationRequestInstructionStarted'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import makeFakeModificationRequest from '../../../../../__tests__/fixtures/modificationRequest'

const { ModificationRequest, Project } = models

describe(`Handler onModificationRequestInstructionStarted`, () => {
  const projetId = new UniqueEntityID().toString()
  const demandeId = new UniqueEntityID().toString()
  beforeEach(async () => {
    await resetDatabase()
  })

  describe(`Traitement des demandes de délai`, () => {
    describe(`Etant donné un événement DemandeDélai existant pour la demande`, () => {
      const événementDéjàDansProjectEvent = {
        id: demandeId,
        projectId: projetId,
        type: 'DemandeDélai',
        valueDate: new Date().getTime(),
        eventPublishedAt: new Date().getTime(),
        payload: {
          statut: 'envoyée',
          autorité: 'dgec',
          dateAchèvementDemandée: new Date().getTime(),
          demandeur: 'id-demandeur',
        },
      }

      it(`
          Lorsqu'on émet un événement 'ModificationRequestInstructionStarted' de type 'délai'
          Alors la demande devrait être mise à jour avec :
              - comme statut : 'en-instruction'
              - et l'information sur qui a rejeter la demande`, async () => {
        await ProjectEvent.create(événementDéjàDansProjectEvent)

        const nouvelEvénementEmis = new ModificationRequestInstructionStarted({
          payload: {
            modificationRequestId: demandeId,
          },
          original: {
            version: 1,
            occurredAt: new Date('2022-02-09'),
          },
        })

        await onModificationRequestInstructionStarted(nouvelEvénementEmis)

        const demandeDélai = await ProjectEvent.findOne({ where: { id: demandeId } })
        expect(demandeDélai).not.toBeNull()
        expect(demandeDélai!).toMatchObject({
          ...événementDéjàDansProjectEvent,
          eventPublishedAt: new Date('2022-02-09').getTime(),
          valueDate: new Date('2022-02-09').getTime(),
          payload: {
            ...événementDéjàDansProjectEvent.payload,
            statut: 'en-instruction',
          },
        })
      })
    })
  })
})

describe('onModificationRequestInstructionStarted', () => {
  const projectId = new UniqueEntityID().toString()
  const modificationRequestId = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a new project event of ModificationRequestInstructionStarted type', async () => {
    await Project.create(makeFakeProject({ id: projectId }))
    await ModificationRequest.create(
      makeFakeModificationRequest({ id: modificationRequestId, projectId })
    )
    await onModificationRequestInstructionStarted(
      new ModificationRequestInstructionStarted({
        payload: {
          modificationRequestId,
        },
        original: {
          version: 1,
          occurredAt: new Date('2022-02-09'),
        },
      })
    )
    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })
    expect(projectEvent).toMatchObject({
      type: 'ModificationRequestInstructionStarted',
      projectId,
      payload: { modificationRequestId },
    })
  })
})
