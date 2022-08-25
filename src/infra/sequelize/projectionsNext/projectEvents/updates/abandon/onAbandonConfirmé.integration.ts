import { resetDatabase } from '../../../../helpers'
import { UniqueEntityID } from '@core/domain'
import { ProjectEvent } from '../..'
import models from '../../../../models'
import makeFakeProject from '../../../../../../__tests__/fixtures/project'
import makeFakeModificationRequest from '../../../../../../__tests__/fixtures/modificationRequest'
import { AbandonConfirmé } from '../../../../../../modules/demandeModification'
import onAbandonConfirmé from './onAbandonConfirmé'

const { ModificationRequest, Project } = models

describe('Projecteur de ProjectEvent onAbandonConfirmé', () => {
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

  describe('Etant donné un événement AbandonConfirmé émis', () => {
    it('Un nouvel événement doit être ajouté à ProjectEvent', async () => {
      await onAbandonConfirmé(
        new AbandonConfirmé({
          payload: { demandeAbandonId, confirméPar: adminId, projetId },
          original: { version: 1, occurredAt: new Date('2022-02-09') },
        })
      )
      const projectEvent = await ProjectEvent.findOne({ where: { projectId: projetId } })
      expect(projectEvent).toMatchObject({
        type: 'ModificationRequestConfirmed',
        projectId: projetId,
        payload: { modificationRequestId: demandeAbandonId },
      })
    })
  })
})
