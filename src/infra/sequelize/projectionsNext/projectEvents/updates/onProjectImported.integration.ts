import { UniqueEntityID } from '@core/domain'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import { ProjectImported, ProjectImportedPayload } from '@modules/project'
import onProjectImported from './onProjectImported'

describe('Handler onProjectImported', () => {
  const projectId = new UniqueEntityID().toString()
  const eventDate = new Date('2022-01-04')
  const notifiedOn = new Date('2022-01-01').getTime()

  beforeEach(async () => {
    await resetDatabase()
  })

  describe(`Projet classé importé`, () => {
    it(`Etant donné un projet lauréat,
    alors deux éléments devraient être ajoutés à project event: 
    - un élément de type 'ProjectImported'
    - un élément de type 'DateMiseEnService'`, async () => {
      await onProjectImported(
        new ProjectImported({
          payload: {
            projectId,
            data: { notifiedOn, classe: 'Classé' },
          } as ProjectImportedPayload,
          original: {
            version: 1,
            occurredAt: eventDate,
          },
        })
      )

      const projectEvent = await ProjectEvent.findAll({ where: { projectId } })

      expect(projectEvent).toHaveLength(2)

      expect(projectEvent[0]).toMatchObject({
        type: 'ProjectImported',
        valueDate: eventDate.getTime(),
        eventPublishedAt: eventDate.getTime(),
        payload: { notifiedOn },
      })

      expect(projectEvent[1]).toMatchObject({
        type: 'DateMiseEnService',
        valueDate: eventDate.getTime(),
        eventPublishedAt: eventDate.getTime(),
        payload: { statut: 'non-renseignée' },
      })
    })
  })

  describe(`Projet éliminé importé`, () => {
    it(`Etant donné un projet éliminé,
    alors un seul élément devrait être ajouté à project event: 
    - un élément de type 'ProjectImported'`, async () => {
      await onProjectImported(
        new ProjectImported({
          payload: {
            projectId,
            data: { notifiedOn, classe: 'Eliminé' },
          } as ProjectImportedPayload,
          original: {
            version: 1,
            occurredAt: eventDate,
          },
        })
      )

      const projectEvent = await ProjectEvent.findAll({ where: { projectId } })

      expect(projectEvent).toHaveLength(1)

      expect(projectEvent[0]).toMatchObject({
        type: 'ProjectImported',
        valueDate: eventDate.getTime(),
        eventPublishedAt: eventDate.getTime(),
        payload: { notifiedOn },
      })
    })
  })
})
