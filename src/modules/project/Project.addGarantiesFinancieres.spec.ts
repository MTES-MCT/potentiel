import { DomainEvent, UniqueEntityID } from '@core/domain'
import { UnwrapForTest } from '@core/utils'
import { appelsOffreStatic } from '@dataAccess/inMemory'
import makeFakeProject from '../../__tests__/fixtures/project'
import {
  ProjectGFDueDateSet,
  ProjectGFSubmitted,
  ProjectGFUploaded,
  ProjectImported,
  ProjectNotified,
} from './events'
import { makeProject } from './Project'
import { makeGetProjectAppelOffre } from '@modules/projectAppelOffre'
import { GFCertificateHasAlreadyBeenSentError } from './errors'

describe('Project.addGarantiesFinancieres()', () => {
  describe('when project GF has to be submitted on Potentiel after application to AO (CRE4)', () => {
    describe('when project already have a GF', () => {
      it('should return a GFCertificateHasAlreadyBeenSentError', () => {
        const projectId = new UniqueEntityID('project1')
        const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic)
        const fakeHistory: DomainEvent[] = [
          new ProjectGFSubmitted({
            payload: {
              projectId: projectId.toString(),
              gfDate: new Date('2022-02-20'),
              fileId: 'file-id1',
              submittedBy: 'user-id',
            },
            original: {
              occurredAt: new Date(123),
              version: 1,
            },
          }),
        ]

        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: fakeHistory,
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          })
        )
        const res = project.addGarantiesFinancieres(new Date('2022-02-21'), 'file-id2', 'user-id')
        expect(res.isErr()).toEqual(true)
        if (res.isOk()) return
        expect(res.error).toBeInstanceOf(GFCertificateHasAlreadyBeenSentError)
      })
    })
    describe('when GF has not been submitted on Potentiel yet', () => {
      it('should emit a ProjectGFSubmitted event', () => {
        const projectId = new UniqueEntityID('project1')
        const candidateEmail = 'email'
        const candidateName = 'name'
        const notifiedOn = new Date('2022-01-01')
        const appelOffreId = 'Fessenheim'
        const periodeId = '2'
        const fakeProject = makeFakeProject({ appelOffreId, periodeId, classe: 'Classé' })
        const { familleId, numeroCRE, potentielIdentifier } = fakeProject
        const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic)

        const fakeHistory: DomainEvent[] = [
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
              candidateEmail,
              candidateName,
              periodeId,
              appelOffreId,
              notifiedOn: notifiedOn.getTime(),
            },
            original: {
              occurredAt: new Date(123),
              version: 1,
            },
          }),
          new ProjectGFDueDateSet({
            payload: {
              projectId: projectId.toString(),
              garantiesFinancieresDueOn: new Date('2022-03-20').getTime(),
            },
            original: {
              occurredAt: new Date(123),
              version: 1,
            },
          }),
        ]

        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: fakeHistory,
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          })
        )

        const gfDate = new Date('2022-02-21')
        const fileId = 'file-id'
        const submittedBy = 'user-id'

        project.addGarantiesFinancieres(gfDate, fileId, submittedBy)

        expect(project.pendingEvents).toHaveLength(1)

        const targetEvent = project.pendingEvents[0]
        if (!targetEvent) return

        expect(targetEvent.type).toEqual(ProjectGFSubmitted.type)
        expect(targetEvent.payload.projectId).toEqual(projectId.toString())
        expect(targetEvent.payload.fileId).toEqual(fileId)
        expect(targetEvent.payload.submittedBy).toEqual(submittedBy)
      })
    })
  })
  describe('when project GF has to be submitted when applying to AO but can be uploaded later on Potentiel (PPE2)', () => {
    describe('when project already have a GF', () => {
      it('should return a GFCertificateHasAlreadyBeenSentError', () => {
        const projectId = new UniqueEntityID('project1')
        const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic)
        const fakeHistory: DomainEvent[] = [
          new ProjectGFUploaded({
            payload: {
              projectId: new UniqueEntityID('project1').toString(),
              gfDate: new Date('2022-02-20'),
              fileId: 'file-id1',
              submittedBy: 'user-id',
            },
            original: {
              occurredAt: new Date(123),
              version: 1,
            },
          }),
        ]

        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: fakeHistory,
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          })
        )
        const res = project.addGarantiesFinancieres(new Date('2022-02-21'), 'file-id2', 'user-id')
        expect(res.isErr()).toEqual(true)
        if (res.isOk()) return
        expect(res.error).toBeInstanceOf(GFCertificateHasAlreadyBeenSentError)
      })
    })
    describe('when GF document has not been uploaded on Potentiel yet', () => {
      it('should emit a ProjectGFUploaded event', () => {
        const projectId = new UniqueEntityID('project1')
        const candidateEmail = 'email'
        const candidateName = 'name'
        const notifiedOn = new Date('2022-01-01')
        const appelOffreId = 'PPE2 - Sol'
        const periodeId = '1'
        const fakeProject = makeFakeProject({ appelOffreId, periodeId, classe: 'Classé' })
        const { familleId, numeroCRE, potentielIdentifier } = fakeProject
        const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic)

        const fakeHistory: DomainEvent[] = [
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
              candidateEmail,
              candidateName,
              periodeId,
              appelOffreId,
              notifiedOn: notifiedOn.getTime(),
            },
            original: {
              occurredAt: new Date(123),
              version: 1,
            },
          }),
        ]

        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: fakeHistory,
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          })
        )

        const gfDate = new Date('2022-02-21')
        const fileId = 'file-id'
        const submittedBy = 'user-id'

        project.addGarantiesFinancieres(gfDate, fileId, submittedBy)

        expect(project.pendingEvents).toHaveLength(1)

        const targetEvent = project.pendingEvents[0]
        if (!targetEvent) return

        expect(targetEvent.type).toEqual(ProjectGFUploaded.type)
        expect(targetEvent.payload.projectId).toEqual(projectId.toString())
        expect(targetEvent.payload.fileId).toEqual(fileId)
        expect(targetEvent.payload.submittedBy).toEqual(submittedBy)
      })
    })
  })
})
