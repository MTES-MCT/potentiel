import { resetDatabase } from '../../../helpers'
import { UniqueEntityID } from '@core/domain'
import {
  ModificationRequestAccepted,
  ModificationRequestAcceptedPayload,
} from '@modules/modificationRequest'
import { ProjectEvent } from '..'
import models from '../../../models'
import onModificationRequestAccepted from './onModificationRequestAccepted'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import makeFakeModificationRequest from '../../../../../__tests__/fixtures/modificationRequest'
import makeFakeFile from '../../../../../__tests__/fixtures/file'

const { ModificationRequest, Project, File } = models

describe('Handler onModificationRequestAccepted', () => {
  const projectId = new UniqueEntityID().toString()
  const modificationRequestId = new UniqueEntityID().toString()
  const adminId = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
    await Project.create(makeFakeProject({ id: projectId }))
    await ModificationRequest.create(
      makeFakeModificationRequest({ id: modificationRequestId, projectId })
    )
  })

  describe(`Cas général`, () => {
    describe('Etant donné un événement ModificationRequestAccepted émis sans responseFileId', () => {
      it('Un nouvel événement doit être ajouté à ProjectEvent sans fichier de réponse', async () => {
        await onModificationRequestAccepted(
          new ModificationRequestAccepted({
            payload: {
              modificationRequestId,
              acceptedBy: adminId,
            } as ModificationRequestAcceptedPayload,
            original: {
              version: 1,
              occurredAt: new Date('2022-02-09'),
            },
          })
        )
        const projectEvent = await ProjectEvent.findOne({ where: { projectId } })
        expect(projectEvent).toMatchObject({
          type: 'ModificationRequestAccepted',
          projectId,
          payload: { modificationRequestId, file: {} },
        })
      })
    })

    describe('Etant donné un événement ModificationRequestAccepted émis avec responseFileId', () => {
      it('Un nouvel événement doit être ajouté à ProjectEvent avec fichier de réponse', async () => {
        await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

        await onModificationRequestAccepted(
          new ModificationRequestAccepted({
            payload: {
              modificationRequestId,
              acceptedBy: adminId,
              responseFileId: fileId,
            } as ModificationRequestAcceptedPayload,
            original: {
              version: 1,
              occurredAt: new Date('2022-02-09'),
            },
          })
        )
        const projectEvent = await ProjectEvent.findOne({ where: { projectId } })
        expect(projectEvent).toMatchObject({
          type: 'ModificationRequestAccepted',
          projectId,
          payload: { modificationRequestId, file: { name: 'filename', id: fileId } },
        })
      })
    })
  })

  describe('Cas des demandes de délai', () => {
    describe(`Etant donné un événement de type ModificationRequestAccepted pour un délai`, () => {
      const nouvelEvénement = new ModificationRequestAccepted({
        payload: {
          modificationRequestId,
          acceptedBy: adminId,
          responseFileId: fileId,
          params: { type: 'delai', delayInMonths: 5 },
        } as ModificationRequestAcceptedPayload,
        original: {
          version: 1,
          occurredAt: new Date('2022-02-09'),
        },
      })
      describe(`S'il y a déjà un événement de type DemandeDélai correspondant au même id dans ProjectEvent`, () => {
        it(`Alors le statut de l'événement devrait être mis à jour`, async () => {
          await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

          await ProjectEvent.create({
            id: modificationRequestId,
            projectId,
            type: 'DemandeDélai',
            valueDate: new Date('2022-08-08').getTime(),
            eventPublishedAt: new Date('2022-08-08').getTime(),
            payload: {
              statut: 'envoyée',
              autorité: 'dreal',
              délaiEnMoisDemandé: 10,
              demandeur: 'id-porteur',
            },
          })

          await onModificationRequestAccepted(nouvelEvénement)

          const projectEvent = await ProjectEvent.findOne({ where: { id: modificationRequestId } })
          expect(projectEvent).toMatchObject({
            id: modificationRequestId,
            type: 'DemandeDélai',
            projectId,
            payload: {
              statut: 'accordée',
              file: { name: 'filename', id: fileId },
              délaiEnMoisAccordé: 5, // délai accordé différent du délai demandé
            },
          })
        })
      })

      describe(`S'il n'y a pas d'événement de type DemandeDélai correspondant au même id dans ProjectEvent`, () => {
        it(`Alors aucun événement ne doit être ajouté`, async () => {
          await onModificationRequestAccepted(nouvelEvénement)

          const projectEvent = await ProjectEvent.findOne({ where: { id: modificationRequestId } })
          expect(projectEvent).toBeNull()
        })
      })
    })
  })
})
