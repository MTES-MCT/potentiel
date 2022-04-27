import { DomainEvent, UniqueEntityID } from '@core/domain'
import { UnwrapForTest } from '@core/utils'
import { appelsOffreStatic } from '@dataAccess/inMemory'
import makeFakeProject from '../../__tests__/fixtures/project'
import { ProjectGFUploaded, ProjectImported, ProjectNotified } from './events'
import { makeProject } from './Project'
import { makeGetProjectAppelOffre } from '@modules/projectAppelOffre'
import {
  GFCertificateHasAlreadyBeenSentError,
  ProjectCannotBeUpdatedIfUnnotifiedError,
} from './errors'
import { UnwrapForTest as OldUnwrapForTest } from '../../types'
import makeFakeUser from '../../__tests__/fixtures/user'
import { makeUser } from '@entities'

const fakeUser = OldUnwrapForTest(makeUser(makeFakeUser()))
const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic)
const projectId = new UniqueEntityID()

describe('Project.uploadGarantiesFinancieres()', () => {
  describe('when the project has not been notified', () => {
    it('should return a ProjectCannotBeUpdatedIfUnnotifiedError', () => {
      const project = UnwrapForTest(
        makeProject({
          projectId,
          getProjectAppelOffre,
          history: [
            new ProjectGFUploaded({
              payload: {
                projectId: projectId.toString(),
                submittedBy: 'user-id',
                fileId: 'id',
                gfDate: new Date('2022-01-01'),
              },
              original: {
                occurredAt: new Date(123),
                version: 1,
              },
            }),
          ],
          buildProjectIdentifier: () => '',
        })
      )
      const res = project.uploadGarantiesFinancieres(
        new Date('2022-01-01'),
        'fileId',
        fakeUser,
        new Date('2025-01-01')
      )

      expect(res.isErr()).toEqual(true)
      if (res.isOk()) return
      expect(res.error).toBeInstanceOf(ProjectCannotBeUpdatedIfUnnotifiedError)
    })
  })
  describe('when the project has been notified', () => {
    describe('when project GF has to be submitted when applying to AO but can be uploaded later on Potentiel (PPE2)', () => {
      const appelOffreId = 'PPE2 - Sol'
      const periodeId = '1'
      const fakeProject = makeFakeProject({ appelOffreId, periodeId, classe: 'Classé' })
      const { familleId, numeroCRE, potentielIdentifier } = fakeProject

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
      ]
      describe('when project already have a GF', () => {
        it('should return a GFCertificateHasAlreadyBeenSentError', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: [
                ...fakeHistory,
                new ProjectGFUploaded({
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
              ],
              getProjectAppelOffre,
              buildProjectIdentifier: () => '',
            })
          )
          const res = project.uploadGarantiesFinancieres(
            new Date('2022-02-21'),
            'file-id2',
            fakeUser,
            new Date('2025-01-01')
          )
          expect(res.isErr()).toEqual(true)
          if (res.isOk()) return
          expect(res.error).toBeInstanceOf(GFCertificateHasAlreadyBeenSentError)
        })
      })
      describe('when GF document has not been uploaded on Potentiel yet', () => {
        it('should emit a ProjectGFUploaded event', () => {
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
          const expirationDate = new Date('2025-01-01')

          project.uploadGarantiesFinancieres(gfDate, fileId, fakeUser, expirationDate)

          expect(project.pendingEvents).toHaveLength(1)

          const targetEvent = project.pendingEvents[0]
          if (!targetEvent) return

          expect(targetEvent.type).toEqual(ProjectGFUploaded.type)
          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
          expect(targetEvent.payload.fileId).toEqual(fileId)
          expect(targetEvent.payload.submittedBy).toEqual(fakeUser.id)
          expect(targetEvent.payload.expirationDate).toEqual(expirationDate)
        })
      })
    })
  })
})
