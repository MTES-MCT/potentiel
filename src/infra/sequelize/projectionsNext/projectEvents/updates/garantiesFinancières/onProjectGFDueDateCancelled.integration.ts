import { UniqueEntityID } from '@core/domain'
import { resetDatabase } from '@infra/sequelize/helpers'
import { ProjectGFDueDateCancelled } from '@modules/project'
import {
  GarantiesFinancièresDueEventPayload,
  GarantiesFinancièresUploadedEventPayload,
} from '../../events/GarantiesFinancièresEvent'
import { ProjectEvent } from '../../projectEvent.model'
import onProjectGFDueDateCancelled from './onProjectGFDueDateCancelled'

describe(`ProjectEvents handler onProjectGFDueDateCancelled lorsqu'un événement ProjectGFDueDateCancelled est émis`, () => {
  const projectId = new UniqueEntityID().toString()
  const fichier = { name: 'fichier', id: 'id' }
  beforeEach(async () => {
    await resetDatabase()
  })
  describe(`Pas d'élément GF correspondant dans ProjectEvent`, () => {
    it(`Si aucun élément de type 'GarantiesFinancières' n'est retrouvé dans ProjectEvent,
  alors on ne modifie pas ProjectEvents et l'événement ProjectGFDueDateCancelled est ignoré`, async () => {
      // ProjectEvent vide à ce stade
      await onProjectGFDueDateCancelled(new ProjectGFDueDateCancelled({ payload: { projectId } }))
      const projectEventGF = await ProjectEvent.findOne({
        where: { projectId, type: 'GarantiesFinancières' },
      })
      expect(projectEventGF).toBeNull()
    })
  })

  describe(`Elément de type GF trouvé dans ProjectEvent mais sans date due`, () => {
    it(`Si l'élément GF trouvé dans ProjectEvent est de type 'uploaded' sans date due,
  alors on ne modifie pas ProjectEvents et l'événement ProjectGFDueDateCancelled est ignoré`, async () => {
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
  })

  describe(`Elément GF trouvé dans ProjectEvent avec une date limite due`, () => {
    it(`Etant donné un élément "GarantiesFinancières" de type 'due' avec une date limite due, 
  alors cet événement doit être supprimé`, async () => {
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

    it(`Etant donné un élement "GarantiesFinancières" de type 'uploaded' avec une date limite due sans son payload, 
  alors seule la date limite d'envoi doit être retirée du payload et l'élément est conservé`, async () => {
      // situation d'un projet soumis à GF après candidature avec GF 'uploadées' par la Dreal
      // suite d'événements dans ce cas : ProjectGFDueDateSet, ProjectGFUploaded
      const élémentGFInitial = {
        id: new UniqueEntityID().toString(),
        type: 'GarantiesFinancières',
        projectId,
        valueDate: 123,
        eventPublishedAt: 123,
        payload: {
          statut: 'uploaded',
          dateLimiteDEnvoi: 456,
          fichier,
          initiéParRole: 'porteur-projet',
        } as GarantiesFinancièresUploadedEventPayload,
      }
      await ProjectEvent.create(élémentGFInitial)

      await onProjectGFDueDateCancelled(new ProjectGFDueDateCancelled({ payload: { projectId } }))

      const élémentGFFinal = await ProjectEvent.findOne({
        where: { projectId, type: 'GarantiesFinancières' },
      })

      expect(élémentGFFinal?.get().payload).toMatchObject({
        statut: 'uploaded',
        //dateLimiteDEnvoi: 456,
        fichier,
        initiéParRole: 'porteur-projet',
      })
    })

    it(`Etant donné un élement "GarantiesFinancières" de type 'pending-validation' avec une date limite due, 
  alors cet élement doit être supprimé`, () => {})

    it(`Etant donné un élement "GarantiesFinancières" de type 'validated' avec une date limite due, 
  alors cet élement doit être supprimé`, () => {})
  })
})
