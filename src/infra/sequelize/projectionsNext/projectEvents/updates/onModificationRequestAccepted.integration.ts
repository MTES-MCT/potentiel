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
          payload: { modificationRequestId },
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

  describe(`Cas d'un recours`, () => {
    it(`Etant donnée une demande de recours acceptée,
    alors un item 'DateMiseEnService' avec le statut 'non-renseignée' devrait être ajouté`, async () => {
      await onModificationRequestAccepted(
        new ModificationRequestAccepted({
          payload: {
            modificationRequestId,
            acceptedBy: adminId,
            responseFileId: fileId,
            params: { type: 'recours' },
          } as ModificationRequestAcceptedPayload,
          original: {
            version: 1,
            occurredAt: new Date('2022-02-09'),
          },
        })
      )

      const projectEvent = await ProjectEvent.findOne({
        where: { projectId, type: 'DateMiseEnService' },
      })

      expect(projectEvent).toMatchObject({
        payload: { statut: 'non-renseignée' },
      })
    })
  })
})
