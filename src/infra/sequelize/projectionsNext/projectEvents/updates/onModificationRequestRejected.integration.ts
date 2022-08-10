import { resetDatabase } from '../../../helpers'
import { UniqueEntityID } from '@core/domain'
import { ModificationRequestRejected } from '@modules/modificationRequest'
import { ProjectEvent } from '..'
import models from '../../../models'
import onModificationRequestRejected from './onModificationRequestRejected'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import makeFakeModificationRequest from '../../../../../__tests__/fixtures/modificationRequest'
import makeFakeFile from '../../../../../__tests__/fixtures/file'

const { ModificationRequest, Project, File } = models

describe(`Handler onModificationRequestRejected`, () => {
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
          Lorsqu'on émet un événement 'ModificationRequestRejected' de type 'délai'
          Alors la demande devrait être mise à jour avec :
              - comme statut : 'rejetée'
              - et l'information sur qui a rejeter la demande`, async () => {
        await ProjectEvent.create(événementDéjàDansProjectEvent)

        const nouvelEvénementEmis = new ModificationRequestRejected({
          payload: {
            modificationRequestId: demandeId,
            rejectedBy: 'id-admin',
            responseFileId: 'id-fichier',
          },
          original: {
            version: 1,
            occurredAt: new Date('2022-02-09'),
          },
        })

        await onModificationRequestRejected(nouvelEvénementEmis)

        const demandeDélai = await ProjectEvent.findOne({ where: { id: demandeId } })
        expect(demandeDélai).not.toBeNull()
        expect(demandeDélai!).toMatchObject({
          ...événementDéjàDansProjectEvent,
          eventPublishedAt: new Date('2022-02-09').getTime(),
          valueDate: new Date('2022-02-09').getTime(),
          payload: {
            ...événementDéjàDansProjectEvent.payload,
            statut: 'rejetée',
            rejetéPar: 'id-admin',
          },
        })
      })
    })
  })
})

describe('onModificationRequestRejected', () => {
  const projectId = new UniqueEntityID().toString()
  const modificationRequestId = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()
  const adminId = new UniqueEntityID().toString()
  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a new project event of ModificationRequestRejected type', async () => {
    await Project.create(makeFakeProject({ id: projectId }))
    await ModificationRequest.create(
      makeFakeModificationRequest({ id: modificationRequestId, projectId })
    )
    await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

    await onModificationRequestRejected(
      new ModificationRequestRejected({
        payload: {
          modificationRequestId,
          rejectedBy: adminId,
          responseFileId: fileId,
        },
        original: {
          version: 1,
          occurredAt: new Date('2022-02-09'),
        },
      })
    )
    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })
    expect(projectEvent).toMatchObject({
      type: 'ModificationRequestRejected',
      projectId,
      payload: { modificationRequestId, file: { name: 'filename', id: fileId } },
    })
  })
})
