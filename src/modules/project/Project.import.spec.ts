import moment from 'moment'
import { UniqueEntityID } from '../../core/domain'
import { UnwrapForTest } from '../../core/utils'
import { appelsOffreStatic } from '../../dataAccess/inMemory/appelOffre'
import makeFakeProject from '../../__tests__/fixtures/project'
import { ProjectCompletionDueDateSet, ProjectImported } from './events'
import { makeProject } from './Project'

const appelsOffres = appelsOffreStatic.reduce((map, appelOffre) => {
  map[appelOffre.id] = appelOffre
  return map
}, {})

const projectId = new UniqueEntityID('project1')
const fakeProject = makeFakeProject({
  classe: 'Classé',
  id: projectId.toString(),
  prixReference: 1,
  evaluationCarbone: 2,
  details: {
    detail1: 'detail1',
    detail2: 'detail2',
  },
})
const { periodeId, appelOffreId, familleId, numeroCRE } = fakeProject

const importId = new UniqueEntityID().toString()

describe('Project.import()', () => {
  const project = UnwrapForTest(
    makeProject({
      projectId,
      appelsOffres,
    })
  )

  it('should trigger ProjectImported', () => {
    project.import({ data: fakeProject, importId })

    expect(project.pendingEvents).toHaveLength(1)

    const targetEvent = project.pendingEvents.find((item) => item.type === ProjectImported.type) as
      | ProjectImported
      | undefined
    expect(targetEvent).toBeDefined()
    if (!targetEvent) return

    expect(targetEvent.payload.projectId).toEqual(projectId.toString())
    expect(targetEvent.payload.importId).toEqual(importId)
    expect(targetEvent.payload.appelOffreId).toEqual(appelOffreId)
    expect(targetEvent.payload.periodeId).toEqual(periodeId)
    expect(targetEvent.payload.familleId).toEqual(familleId)
    expect(targetEvent.payload.numeroCRE).toEqual(numeroCRE)
    expect(targetEvent.payload.data).toMatchObject(fakeProject)
  })
})
