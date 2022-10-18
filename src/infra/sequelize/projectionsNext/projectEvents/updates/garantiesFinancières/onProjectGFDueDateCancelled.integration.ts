import { UniqueEntityID } from '@core/domain'
import { resetDatabase } from '@infra/sequelize/helpers'
import { ProjectGFDueDateCancelled } from '@modules/project'
import {
  GarantiesFinancièresDueEventPayload,
  GarantiesFinancièresUploadedEventPayload,
} from '../../events/GarantiesFinancièresEvent'
import { ProjectEvent } from '../../projectEvent.model'
import onProjectGFDueDateCancelled from './onProjectGFDueDateCancelled'

describe(`Handler onProjectGFDueDateCancelled`, () => {
  const projectId = new UniqueEntityID().toString()
  const fichier = { name: 'fichier', id: 'id' }
  beforeEach(async () => {
    await resetDatabase()
  })
  it(`Étant donné aucun élément de type GF dans ProjectEvent
      Lorsque un énement de type 'ProjectGFDueDateCancelled' survient
      Alors l'évènement devrait être ignoré`, async () => {
    await onProjectGFDueDateCancelled(new ProjectGFDueDateCancelled({ payload: { projectId } }))
    const projectEventGF = await ProjectEvent.findOne({
      where: { projectId, type: 'GarantiesFinancières' },
    })
    expect(projectEventGF).toBeNull()
  })

  it(`Etant donné un élément GF trouvé dans ProjectEvent de type 'uploaded' sans date due,
      Lorsque un énement de type 'ProjectGFDueDateCancelled' survient
      Alors on ne modifie pas ProjectEvents et l'événement ProjectGFDueDateCancelled est ignoré`, async () => {
    const élémentGFInitial = {
      id: new UniqueEntityID().toString(),
      type: 'GarantiesFinancières',
      projectId,
      valueDate: 123,
      eventPublishedAt: 123,
      payload: {
        statut: 'uploaded',
        dateConstitution: 123,
        fichier,
        initiéParRole: 'porteur-projet',
      } as GarantiesFinancièresUploadedEventPayload,
    }
    await ProjectEvent.create(élémentGFInitial)
    await onProjectGFDueDateCancelled(new ProjectGFDueDateCancelled({ payload: { projectId } }))

    const élémentGFFinal = await ProjectEvent.findOne({
      where: { projectId, type: 'GarantiesFinancières' },
    })
    expect(élémentGFFinal?.get()).toMatchObject(élémentGFInitial)
  })

  it(`Etant donné un élément GF trouvé dans ProjectEvent de type 'uploaded' avec une date due,
      Lorsque un énement de type 'ProjectGFDueDateCancelled' survient
      Alors cet événement doit être supprimé`, async () => {
    const élémentGFInitial = {
      id: new UniqueEntityID().toString(),
      type: 'GarantiesFinancières',
      projectId,
      valueDate: 123,
      eventPublishedAt: 123,
      payload: {
        statut: 'due',
        dateLimiteDEnvoi: 456,
      } as GarantiesFinancièresDueEventPayload,
    }
    await ProjectEvent.create(élémentGFInitial)
    await onProjectGFDueDateCancelled(new ProjectGFDueDateCancelled({ payload: { projectId } }))

    const élémentGFFinal = await ProjectEvent.findOne({
      where: { projectId, type: 'GarantiesFinancières' },
    })
    expect(élémentGFFinal).toBeNull()
  })

  for (const statut of ['uploaded', 'validated', 'pending-validation']) {
    it(`Etant donné un élement "GarantiesFinancières" de type '${statut}' avec une date limite due dans son payload, 
        Lorsque un énement de type 'ProjectGFDueDateCancelled' survient
        Alors seule la date limite d'envoi doit être retirée du payload et l'élément est conservé`, async () => {
      const élémentGFInitial = {
        id: new UniqueEntityID().toString(),
        type: 'GarantiesFinancières',
        projectId,
        valueDate: 123,
        eventPublishedAt: 123,
        payload: {
          statut,
          dateLimiteDEnvoi: 456,
          fichier,
          initiéParRole: 'porteur-projet',
        },
      }
      await ProjectEvent.create(élémentGFInitial)
      await onProjectGFDueDateCancelled(new ProjectGFDueDateCancelled({ payload: { projectId } }))

      const élémentGFFinal = await ProjectEvent.findOne({
        where: { projectId, type: 'GarantiesFinancières' },
      })
      expect(élémentGFFinal?.get().payload).toEqual({
        statut,
        fichier: { name: 'fichier', id: 'id' },
        initiéParRole: 'porteur-projet',
      })
    })
  }
})
