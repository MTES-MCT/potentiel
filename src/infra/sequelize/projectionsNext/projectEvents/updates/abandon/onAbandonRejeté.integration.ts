import { resetDatabase } from '../../../../helpers'
import { UniqueEntityID } from '@core/domain'
import { ModificationRequestAccepted } from '@modules/modificationRequest'
import { ProjectEvent } from '../..'
import models from '../../../../models'
import makeFakeProject from '../../../../../../__tests__/fixtures/project'
import makeFakeModificationRequest from '../../../../../../__tests__/fixtures/modificationRequest'
import makeFakeFile from '../../../../../../__tests__/fixtures/file'
import { AbandonRejeté } from '../../../../../../modules/demandeModification'
import onAbandonRejeté from './onAbandonRejeté'

const { ModificationRequest, Project, File } = models

describe('Projecteur de ProjectEvent onAbandonRejeté', () => {
  const projetId = new UniqueEntityID().toString()
  const demandeAbandonId = new UniqueEntityID().toString()
  const adminId = new UniqueEntityID().toString()
  const fichierRéponseId = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
    await Project.create(makeFakeProject({ id: projetId }))
    await ModificationRequest.create(
      makeFakeModificationRequest({ id: demandeAbandonId, projectId: projetId })
    )
  })

  describe('Etant donné un événement AbandonRejeté émis avec responseFileId', () => {
    it('Un nouvel événement doit être ajouté à ProjectEvent avec fichier de réponse', async () => {
      await File.create(makeFakeFile({ id: fichierRéponseId, filename: 'filename' }))

      await onAbandonRejeté(
        new AbandonRejeté({
          payload: { demandeAbandonId, rejetéPar: adminId, fichierRéponseId, projetId },
          original: { version: 1, occurredAt: new Date('2022-02-09') },
        })
      )
      const projectEvent = await ProjectEvent.findOne({ where: { projectId: projetId } })
      expect(projectEvent).toMatchObject({
        type: 'ModificationRequestRejected',
        projectId: projetId,
        payload: {
          modificationRequestId: demandeAbandonId,
          file: { name: 'filename', id: fichierRéponseId },
        },
      })
    })
  })
})
