import { UniqueEntityID } from '@core/domain'
import { ProjectGFDueDateSet, ProjectGFDueDateSetPayload } from '@modules/project'
import { resetDatabase } from '../../../../helpers'
import { GarantiesFinancièresDueEventPayload } from '../../events/GarantiesFinancièresEvent'
import { ProjectEvent } from '../../projectEvent.model'
import onProjectGFDueDateSet from './onProjectGFDueDateSet'

describe('onProjectGFDueDateSet', () => {
  const projectId = new UniqueEntityID().toString()
  const garantiesFinancieresDuesLe = new Date('2022-01-27').getTime()
  const occurredAt = new Date('2021-11-27')
  const fichier = { id: 'id', name: 'name' }

  beforeEach(async () => {
    await resetDatabase()
  })

  describe(`Pas d'élément de type GF correspondant dans ProjectEvent`, () => {
    it(`Si aucun élément de type GF n'est trouvé dans ProjectEvent,
    alors un nouvel élément devrait être créé`, async () => {
      await onProjectGFDueDateSet(
        new ProjectGFDueDateSet({
          payload: {
            projectId,
            garantiesFinancieresDueOn: garantiesFinancieresDuesLe,
          } as ProjectGFDueDateSetPayload,
          original: {
            version: 1,
            occurredAt,
          },
        })
      )

      const élémentGFFinal = await ProjectEvent.findOne({
        where: { projectId, type: 'GarantiesFinancières' },
      })

      expect(élémentGFFinal).toMatchObject({
        type: 'GarantiesFinancières',
        eventPublishedAt: occurredAt.getTime(),
        payload: { dateLimiteDEnvoi: garantiesFinancieresDuesLe },
      })
    })
  })
  describe(`Elément de type GF correspondant dans ProjectEvent`, () => {
    it(`Etant donné un élément de statut 'due' sans date limite d'envoi,
    alors la date limite d'envoi devrait être ajoutée`, async () => {
      const élémentId = new UniqueEntityID().toString()
      const élémentGFInitial = {
        id: élémentId,
        type: 'GarantiesFinancières',
        projectId,
        valueDate: 123,
        eventPublishedAt: 123,
        payload: {
          statut: 'due',
        } as GarantiesFinancièresDueEventPayload,
      }
      await ProjectEvent.create(élémentGFInitial)

      await onProjectGFDueDateSet(
        new ProjectGFDueDateSet({
          payload: {
            projectId,
            garantiesFinancieresDueOn: garantiesFinancieresDuesLe,
          } as ProjectGFDueDateSetPayload,
          original: {
            version: 1,
            occurredAt,
          },
        })
      )

      const élémentGFFinal = await ProjectEvent.findOne({
        where: { projectId, type: 'GarantiesFinancières', id: élémentId },
      })

      expect(élémentGFFinal).toMatchObject({
        type: 'GarantiesFinancières',
        eventPublishedAt: occurredAt.getTime(),
        payload: { dateLimiteDEnvoi: garantiesFinancieresDuesLe },
      })
    })

    it(`Etant donné un élément de statut 'due' avec date limite d'envoi,
    alors la date limite d'envoi devrait être mise à jour`, async () => {
      const élémentId = new UniqueEntityID().toString()
      const élémentGFInitial = {
        id: élémentId,
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

      await onProjectGFDueDateSet(
        new ProjectGFDueDateSet({
          payload: {
            projectId,
            garantiesFinancieresDueOn: garantiesFinancieresDuesLe,
          } as ProjectGFDueDateSetPayload,
          original: {
            version: 1,
            occurredAt,
          },
        })
      )

      const élémentGFFinal = await ProjectEvent.findOne({
        where: { projectId, type: 'GarantiesFinancières', id: élémentId },
      })

      expect(élémentGFFinal).toMatchObject({
        type: 'GarantiesFinancières',
        eventPublishedAt: occurredAt.getTime(),
        payload: { dateLimiteDEnvoi: garantiesFinancieresDuesLe },
      })
    })

    for (const statut of ['uploaded', 'validated', 'pending-validation']) {
      it(`Etant donné un élément de statut '${statut}' avec date limite d'envoi,
      alors la date limite d'envoi devrait être mise à jour 
      et le fichier conservé`, async () => {
        const élémentId = new UniqueEntityID().toString()
        const élémentGFInitial = {
          id: élémentId,
          type: 'GarantiesFinancières',
          projectId,
          valueDate: 123,
          eventPublishedAt: 123,
          payload: {
            statut,
            dateLimiteDEnvoi: 456,
            fichier,
          },
        }
        await ProjectEvent.create(élémentGFInitial)

        await onProjectGFDueDateSet(
          new ProjectGFDueDateSet({
            payload: {
              projectId,
              garantiesFinancieresDueOn: garantiesFinancieresDuesLe,
            } as ProjectGFDueDateSetPayload,
            original: {
              version: 1,
              occurredAt,
            },
          })
        )

        const élémentGFFinal = await ProjectEvent.findOne({
          where: { projectId, type: 'GarantiesFinancières', id: élémentId },
        })

        expect(élémentGFFinal).toMatchObject({
          type: 'GarantiesFinancières',
          eventPublishedAt: occurredAt.getTime(),
          payload: { dateLimiteDEnvoi: garantiesFinancieresDuesLe, fichier },
        })
      })
    }

    it(`Etant donné un élément de statut 'uploaded' sans date limite d'envoi,
    alors la date limite d'envoi devrait être ajoutée 
    et le fichier conservé`, async () => {
      const élémentId = new UniqueEntityID().toString()
      const élémentGFInitial = {
        id: élémentId,
        type: 'GarantiesFinancières',
        projectId,
        valueDate: 123,
        eventPublishedAt: 123,
        payload: {
          statut: 'uploaded',
          fichier,
        },
      }
      await ProjectEvent.create(élémentGFInitial)

      await onProjectGFDueDateSet(
        new ProjectGFDueDateSet({
          payload: {
            projectId,
            garantiesFinancieresDueOn: garantiesFinancieresDuesLe,
          } as ProjectGFDueDateSetPayload,
          original: {
            version: 1,
            occurredAt,
          },
        })
      )

      const élémentGFFinal = await ProjectEvent.findOne({
        where: { projectId, type: 'GarantiesFinancières', id: élémentId },
      })

      expect(élémentGFFinal).toMatchObject({
        type: 'GarantiesFinancières',
        eventPublishedAt: occurredAt.getTime(),
        payload: { dateLimiteDEnvoi: garantiesFinancieresDuesLe, fichier },
      })
    })
  })
})
