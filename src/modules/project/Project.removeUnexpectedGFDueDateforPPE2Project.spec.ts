import { UniqueEntityID } from '@core/domain'
import { UnwrapForTest } from '@core/utils'
import { appelsOffreStatic } from '@dataAccess/inMemory'
import { makeGetProjectAppelOffre } from '@modules/projectAppelOffre'
import makeFakeProject from '../../__tests__/fixtures/project'
import {
  ProjectGFDueDateSet,
  ProjectGFUploaded,
  ProjectImported,
  ProjectNotified,
  ProjectProducteurUpdated,
} from './events'
import { makeProject } from './Project'

const projectId = new UniqueEntityID()
const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic)
const appelOffreId = 'PPE2 - Bâtiment'
const periodeId = '1'
const fakeProject = makeFakeProject({ appelOffreId, periodeId, classe: 'Classé' })
const { familleId, numeroCRE, potentielIdentifier } = fakeProject

describe(`Project.removeUnexpectedGFDueDateforPPE2Project() 
  pour des projets PPE2 qui ont une date de GF due`, () => {
  describe(`Etant donné un projet qui n'a pas de GF 
    et qui n'a pas de changement de producteur`, () => {
    it('Un événement ProjectGFDueDateCancelled devrait être émis', () => {
      const project = UnwrapForTest(
        makeProject({
          projectId,
          history: [
            new ProjectImported({
              payload: {
                projectId: projectId.toString(),
                periodeId,
                appelOffreId,
                familleId,
                numeroCRE,
                importId: '',
                data: fakeProject,
                potentielIdentifier,
              },
              original: {
                occurredAt: new Date(123),
                version: 1,
              },
            }),
            new ProjectNotified({
              payload: {
                projectId: projectId.toString(),
                periodeId,
                appelOffreId,
                familleId,
                candidateEmail: 'test@test.com',
                candidateName: '',
                notifiedOn: 123,
              },
              original: {
                occurredAt: new Date(456),
                version: 1,
              },
            }),
            new ProjectGFDueDateSet({
              payload: {
                projectId: projectId.toString(),
                garantiesFinancieresDueOn: new Date('2022-10-01').getTime(),
              },
              original: {
                occurredAt: new Date(456),
                version: 1,
              },
            }),
          ],
          getProjectAppelOffre,
          buildProjectIdentifier: () => '',
        })
      )

      const res = project.removeUnexpectedGFDueDateforPPE2Project()

      expect(res.isOk()).toEqual(true)
      expect(project.pendingEvents).toHaveLength(1)
      expect(project.pendingEvents[0].type).toEqual('ProjectGFDueDateCancelled')
      expect(project.pendingEvents[0].payload.projectId).toEqual(projectId.toString())
    })
  })

  describe(`Etant donné un projet qui a des GF uploadées`, () => {
    it('Un événement ProjectGFDueDateCancelled devrait être émis', () => {
      const project = UnwrapForTest(
        makeProject({
          projectId,
          history: [
            new ProjectImported({
              payload: {
                projectId: projectId.toString(),
                periodeId,
                appelOffreId,
                familleId,
                numeroCRE,
                importId: '',
                data: fakeProject,
                potentielIdentifier,
              },
              original: {
                occurredAt: new Date(123),
                version: 1,
              },
            }),
            new ProjectNotified({
              payload: {
                projectId: projectId.toString(),
                periodeId,
                appelOffreId,
                familleId,
                candidateEmail: 'test@test.com',
                candidateName: '',
                notifiedOn: 123,
              },
              original: {
                occurredAt: new Date(456),
                version: 1,
              },
            }),
            new ProjectGFUploaded({
              payload: {
                projectId: projectId.toString(),
                gfDate: new Date('2021-01-01'),
                fileId: '123',
                submittedBy: '123',
              },
              original: {
                occurredAt: new Date(456),
                version: 1,
              },
            }),
            new ProjectGFDueDateSet({
              payload: {
                projectId: projectId.toString(),
                garantiesFinancieresDueOn: new Date('2022-10-01').getTime(),
              },
              original: {
                occurredAt: new Date(456),
                version: 1,
              },
            }),
          ],
          getProjectAppelOffre,
          buildProjectIdentifier: () => '',
        })
      )

      const res = project.removeUnexpectedGFDueDateforPPE2Project()

      expect(res.isOk()).toEqual(true)
      expect(project.pendingEvents).toHaveLength(1)
      expect(project.pendingEvents[0].type).toEqual('ProjectGFDueDateCancelled')
      expect(project.pendingEvents[0].payload.projectId).toEqual(projectId.toString())
    })
  })

  describe(`Etant donné un projet qui n'a pas de GF 
    et qui a eu un changement de producteur`, () => {
    it(`L'événement ProjectGFDueDateCancelled ne devrait pas être émis`, () => {
      const project = UnwrapForTest(
        makeProject({
          projectId,
          history: [
            new ProjectImported({
              payload: {
                projectId: projectId.toString(),
                periodeId,
                appelOffreId,
                familleId,
                numeroCRE,
                importId: '',
                data: fakeProject,
                potentielIdentifier,
              },
              original: {
                occurredAt: new Date(123),
                version: 1,
              },
            }),
            new ProjectNotified({
              payload: {
                projectId: projectId.toString(),
                periodeId,
                appelOffreId,
                familleId,
                candidateEmail: 'test@test.com',
                candidateName: '',
                notifiedOn: 123,
              },
              original: {
                occurredAt: new Date(456),
                version: 1,
              },
            }),
            new ProjectProducteurUpdated({
              payload: {
                projectId: projectId.toString(),
                newProducteur: 'nouveau producteur',
                updatedBy: 'userId',
              },
              original: {
                occurredAt: new Date(456),
                version: 1,
              },
            }),
            new ProjectGFDueDateSet({
              payload: {
                projectId: projectId.toString(),
                garantiesFinancieresDueOn: new Date('2022-10-01').getTime(),
              },
              original: {
                occurredAt: new Date(456),
                version: 1,
              },
            }),
          ],
          getProjectAppelOffre,
          buildProjectIdentifier: () => '',
        })
      )

      const res = project.removeUnexpectedGFDueDateforPPE2Project()

      expect(res.isOk()).toEqual(true)
      expect(project.pendingEvents).toHaveLength(0)
    })
  })
})
