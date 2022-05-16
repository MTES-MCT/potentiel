import { DomainEvent, UniqueEntityID } from '@core/domain'
import { UnwrapForTest } from '@core/utils'
import makeFakeProject from '../../__tests__/fixtures/project'
import { makeProject } from './Project'
import { makeGetProjectAppelOffre } from '@modules/projectAppelOffre'
import { appelsOffreStatic } from '@dataAccess/inMemory'
import {
  ProjectGFExpirationDateAdded,
  ProjectGFSubmitted,
  ProjectImported,
  ProjectNotified,
} from './events'
import { UnwrapForTest as OldUnwrapForTest } from '../../types'
import makeFakeUser from '../../__tests__/fixtures/user'
import { makeUser } from '@entities'
import { GFAlreadyHasExpirationDateError, ProjectCannotBeUpdatedIfUnnotifiedError } from './errors'
import { NoGFCertificateToUpdateError } from './errors/NoGFCertificateToUpdateError'

const projectId = new UniqueEntityID()
const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic)
const fakeUser = OldUnwrapForTest(makeUser(makeFakeUser()))
const appelOffreId = 'Fessenheim'
const periodeId = '2'
const fakeProject = makeFakeProject({ appelOffreId, periodeId, classe: 'Classé' })
const { familleId, numeroCRE, potentielIdentifier } = fakeProject

describe('Project.addGFExpirationDate()', () => {
  describe('when the project has not been notified', () => {
    it('should return a ProjectCannotBeUpdatedIfUnnotifiedError', () => {
      const project = UnwrapForTest(
        makeProject({
          projectId,
          getProjectAppelOffre,
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
          ],
          buildProjectIdentifier: () => '',
        })
      )

      const res = project.addGFExpirationDate({
        projectId: projectId.toString(),
        submittedBy: fakeUser,
        expirationDate: new Date('2023-01-01'),
      })
      expect(res.isErr()).toEqual(true)
      if (res.isOk()) return
      expect(res.error).toBeInstanceOf(ProjectCannotBeUpdatedIfUnnotifiedError)
    })
  })

  describe('when the project has been notified', () => {
    describe("when the project doesn't have GFs", () => {
      it('should return a NoGFCertificateToUpdateError', () => {
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
            ],
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          })
        )

        const res = project.addGFExpirationDate({
          projectId: projectId.toString(),
          submittedBy: fakeUser,
          expirationDate: new Date('2023-01-01'),
        })

        expect(res.isErr()).toEqual(true)
        if (res.isOk()) return
        expect(res.error).toBeInstanceOf(NoGFCertificateToUpdateError)
      })
    })

    describe('when the project has GFs', () => {
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

      describe('when the GF has already been updated with an expiration date', () => {
        it('should a emit a GFAlreadyHasExpirationDateError', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: [
                ...fakeHistory,
                new ProjectGFExpirationDateAdded({
                  payload: {
                    projectId: projectId.toString(),
                    expirationDate: new Date('2022-02-20'),
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

          const res = project.addGFExpirationDate({
            projectId: projectId.toString(),
            submittedBy: fakeUser,
            expirationDate: new Date('2023-01-01'),
          })

          expect(res.isErr()).toEqual(true)
          if (res.isOk()) return
          expect(res.error).toBeInstanceOf(GFAlreadyHasExpirationDateError)
        })
      })

      describe('when the GF expiration date has been set at GF submission', () => {
        it('should a emit a GFAlreadyHasExpirationDateError', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: [
                ...fakeHistory,
                new ProjectGFSubmitted({
                  payload: {
                    projectId: projectId.toString(),
                    gfDate: new Date('2022-02-20'),
                    fileId: 'file-id1',
                    submittedBy: 'user-id',
                    expirationDate: new Date('2022-01-01'),
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

          const res = project.addGFExpirationDate({
            projectId: projectId.toString(),
            submittedBy: fakeUser,
            expirationDate: new Date('2023-01-01'),
          })

          expect(res.isErr()).toEqual(true)
          if (res.isOk()) return
          expect(res.error).toBeInstanceOf(GFAlreadyHasExpirationDateError)
        })
      })

      describe("when the GFs doesn't have an expiration date yet", () => {
        it('should emit a ProjectGFExpirationDateAdded event', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: [...fakeHistory],
              getProjectAppelOffre,
              buildProjectIdentifier: () => '',
            })
          )

          const res = project.addGFExpirationDate({
            projectId: projectId.toString(),
            submittedBy: fakeUser,
            expirationDate: new Date('2023-01-01'),
          })

          expect(res.isOk()).toEqual(true)
          expect(project.pendingEvents).toHaveLength(1)
          expect(project.pendingEvents[0].type).toEqual('ProjectGFExpirationDateAdded')
          expect(project.pendingEvents[0].payload.expirationDate).toEqual(new Date('2023-01-01'))
        })
      })
    })
  })
})
