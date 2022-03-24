import { UniqueEntityID } from '@core/domain'
import { UnwrapForTest } from '@core/utils'
import { appelsOffreStatic } from '@dataAccess/inMemory'
import makeFakeProject from '../../__tests__/fixtures/project'
import {
  LegacyProjectSourced,
  ProjectActionnaireUpdated,
  ProjectCertificateObsolete,
  ProjectCompletionDueDateSet,
  ProjectDataCorrected,
  ProjectDCRDueDateSet,
  ProjectFournisseursUpdated,
  ProjectGFDueDateSet,
  ProjectImported,
  ProjectNotificationDateSet,
  ProjectProducteurUpdated,
  ProjectPuissanceUpdated,
  ProjectReimported,
} from './events'
import { makeProject } from './Project'
import type { BuildProjectIdentifier } from './queries'
import { makeGetProjectAppelOffre } from '@modules/projectAppelOffre'
import { findEventOfType } from '../../helpers/findEventOfType'

const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic)

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

const fakePotentielIdentifier = 'fakePotentielIdentifier'
const importId = new UniqueEntityID().toString()
const buildProjectIdentifier = jest.fn(
  (args: Parameters<BuildProjectIdentifier>[0]) => fakePotentielIdentifier
)

describe('Project.import({ data, importId })', () => {
  describe('when the project is new', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        getProjectAppelOffre,
        buildProjectIdentifier,
      })
    )

    it('should trigger ProjectImported', () => {
      project.import({ data: fakeProject, importId })

      expect(project.pendingEvents).toHaveLength(1)

      const targetEvent = project.pendingEvents.find(
        (item) => item.type === ProjectImported.type
      ) as ProjectImported | undefined
      expect(targetEvent).toBeDefined()
      if (!targetEvent) return

      expect(targetEvent.payload.projectId).toEqual(projectId.toString())
      expect(targetEvent.payload.importId).toEqual(importId)
      expect(targetEvent.payload.appelOffreId).toEqual(appelOffreId)
      expect(targetEvent.payload.periodeId).toEqual(periodeId)
      expect(targetEvent.payload.familleId).toEqual(familleId)
      expect(targetEvent.payload.numeroCRE).toEqual(numeroCRE)
      expect(targetEvent.payload.data).toMatchObject(fakeProject)
      expect(targetEvent.payload.potentielIdentifier).toEqual(fakePotentielIdentifier)

      expect(buildProjectIdentifier).toHaveBeenCalledWith({
        appelOffreId,
        periodeId,
        familleId,
        numeroCRE,
      })
    })

    describe('when data contains a notification date', () => {
      describe('when the project is classé', () => {
        const project = UnwrapForTest(
          makeProject({
            projectId,
            getProjectAppelOffre,
            buildProjectIdentifier,
          })
        )
        project.import({ data: { ...fakeProject, classe: 'Classé', notifiedOn: 1234 }, importId })

        expect(project.pendingEvents).toHaveLength(5)

        it('should trigger a ProjectNotificationDateSet', () => {
          const targetEvent = findEventOfType(ProjectNotificationDateSet, project.pendingEvents)
          expect(targetEvent).toBeDefined()
          if (!targetEvent) return

          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
          expect(targetEvent.payload.notifiedOn).toEqual(1234)
        })

        it('should trigger a ProjectGFDueDateSet', () => {
          const targetEvent = findEventOfType(ProjectGFDueDateSet, project.pendingEvents)
          expect(targetEvent).toBeDefined()
          if (!targetEvent) return

          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
        })

        it('should trigger a ProjectDCRDueDateSet', () => {
          const targetEvent = findEventOfType(ProjectDCRDueDateSet, project.pendingEvents)
          expect(targetEvent).toBeDefined()
          if (!targetEvent) return

          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
        })

        it('should trigger a ProjectCompletionDueDateSet', () => {
          const targetEvent = findEventOfType(ProjectCompletionDueDateSet, project.pendingEvents)
          expect(targetEvent).toBeDefined()
          if (!targetEvent) return

          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
        })
      })

      describe('when the project is éliminé', () => {
        const project = UnwrapForTest(
          makeProject({
            projectId,
            getProjectAppelOffre,
            buildProjectIdentifier,
          })
        )
        project.import({ data: { ...fakeProject, classe: 'Eliminé', notifiedOn: 1234 }, importId })

        it('should trigger a ProjectNotificationDateSet', () => {
          expect(project.pendingEvents).toHaveLength(2)
          const targetEvent = findEventOfType(ProjectNotificationDateSet, project.pendingEvents)
          expect(targetEvent).toBeDefined()
          if (!targetEvent) return

          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
          expect(targetEvent.payload.notifiedOn).toEqual(1234)
        })
      })
    })
  })

  describe('when the project is not new', () => {
    describe('when the project data has not changed', () => {
      const project = UnwrapForTest(
        makeProject({
          projectId,
          history: [
            new LegacyProjectSourced({
              payload: {
                projectId: projectId.toString(),
                periodeId,
                appelOffreId,
                familleId,
                numeroCRE,
                potentielIdentifier: '',
                content: fakeProject,
              },
            }),
          ],
          getProjectAppelOffre,
          buildProjectIdentifier: () => '',
        })
      )

      it('should not emit', () => {
        project.import({ data: fakeProject, importId })

        expect(project.pendingEvents).toHaveLength(0)
      })
    })

    describe('when the project data has changed', () => {
      const project = UnwrapForTest(
        makeProject({
          projectId,
          history: [
            new LegacyProjectSourced({
              payload: {
                projectId: projectId.toString(),
                periodeId,
                appelOffreId,
                familleId,
                numeroCRE,
                potentielIdentifier: '',
                content: fakeProject,
              },
            }),
          ],
          getProjectAppelOffre,
          buildProjectIdentifier: () => '',
        })
      )
      it('should emit ProjectReimported with the changes in the payload', () => {
        project.import({
          data: {
            ...fakeProject,
            prixReference: 3,
            evaluationCarbone: 4,
            details: { detail1: 'changé', detail2: 'detail2' },
          },
          importId,
        })

        const targetEvent = project.pendingEvents.find(
          (item) => item.type === ProjectReimported.type
        ) as ProjectReimported | undefined
        expect(targetEvent).toBeDefined()
        if (!targetEvent) return

        expect(targetEvent.payload.projectId).toEqual(projectId.toString())
        expect(targetEvent.payload.data).toEqual({
          prixReference: 3,
          evaluationCarbone: 4,
          details: { detail1: 'changé' },
        })
      })

      describe('when the project data details field has changed', () => {
        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: [
              new LegacyProjectSourced({
                payload: {
                  projectId: projectId.toString(),
                  periodeId,
                  appelOffreId,
                  familleId,
                  numeroCRE,
                  potentielIdentifier: '',
                  content: { ...fakeProject, details: { param1: 'value1', param2: 'value2' } },
                },
              }),
            ],
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          })
        )
        it('should emit ProjectReimported with the changes in the payload', () => {
          project.import({
            data: {
              ...fakeProject,
              details: { param1: 'value1', param2: 'value2 changed', param3: 'value3' },
            },
            importId,
          })

          const targetEvent = project.pendingEvents.find(
            (item) => item.type === ProjectReimported.type
          ) as ProjectReimported | undefined
          expect(targetEvent).toBeDefined()
          if (!targetEvent) return

          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
          expect(targetEvent.payload.data).toEqual({
            details: { param2: 'value2 changed', param3: 'value3' },
          })
        })
      })

      describe('when project had a previous ProjectActionnaireUpdated', () => {
        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: [
              new LegacyProjectSourced({
                payload: {
                  projectId: projectId.toString(),
                  periodeId,
                  appelOffreId,
                  familleId,
                  numeroCRE,
                  potentielIdentifier: '',
                  content: { ...fakeProject, actionnaire: 'old' },
                },
              }),
              new ProjectActionnaireUpdated({
                payload: {
                  projectId: projectId.toString(),
                  newActionnaire: 'new',
                  updatedBy: '',
                },
              }),
            ],
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          })
        )

        it('should ignore the actionnaire change', () => {
          project.import({
            data: {
              ...fakeProject,
              actionnaire: 'other',
            },
            importId,
          })

          expect(project.pendingEvents).toHaveLength(0)
        })
      })

      describe('when project had a previous ProjectProducteurUpdated', () => {
        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: [
              new LegacyProjectSourced({
                payload: {
                  projectId: projectId.toString(),
                  periodeId,
                  appelOffreId,
                  familleId,
                  numeroCRE,
                  potentielIdentifier: '',
                  content: { ...fakeProject, nomCandidat: 'old' },
                },
              }),
              new ProjectProducteurUpdated({
                payload: {
                  projectId: projectId.toString(),
                  newProducteur: 'new',
                  updatedBy: '',
                },
              }),
            ],
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          })
        )

        it('should ignore the producteur change', () => {
          project.import({
            data: {
              ...fakeProject,
              nomCandidat: 'other',
            },
            importId,
          })

          expect(project.pendingEvents).toHaveLength(0)
        })
      })

      describe('when project had a previous ProjectPuissanceUpdated', () => {
        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: [
              new LegacyProjectSourced({
                payload: {
                  projectId: projectId.toString(),
                  periodeId,
                  appelOffreId,
                  familleId,
                  numeroCRE,
                  potentielIdentifier: '',
                  content: { ...fakeProject, puissance: 123 },
                },
              }),
              new ProjectPuissanceUpdated({
                payload: {
                  projectId: projectId.toString(),
                  newPuissance: 456,
                  updatedBy: '',
                },
              }),
            ],
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          })
        )

        it('should ignore the puissance change', () => {
          project.import({
            data: {
              ...fakeProject,
              puissance: 789,
            },
            importId,
          })

          expect(project.pendingEvents).toHaveLength(0)
        })
      })

      describe('when project had a previous ProjectFournisseursUpdated', () => {
        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: [
              new LegacyProjectSourced({
                payload: {
                  projectId: projectId.toString(),
                  periodeId,
                  appelOffreId,
                  familleId,
                  numeroCRE,
                  potentielIdentifier: '',
                  content: {
                    ...fakeProject,
                    details: {
                      'Nom du fabricant \n(Modules ou films)': 'module1',
                      'Nom du fabricant (Cellules)': 'cellule1',
                    },
                  },
                },
              }),
              new ProjectFournisseursUpdated({
                payload: {
                  projectId: projectId.toString(),
                  newFournisseurs: [
                    {
                      kind: 'Nom du fabricant \n(Modules ou films)',
                      name: 'module2',
                    },
                  ],
                  newEvaluationCarbone: 123,
                  updatedBy: '',
                },
              }),
            ],
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          })
        )

        it('should ignore the change on the fournisseur that had been updated', () => {
          project.import({
            data: {
              ...fakeProject,
              details: {
                'Nom du fabricant \n(Modules ou films)': 'module1', // was updated by ProjectFournisseursUpdated, should be ignored
                'Nom du fabricant (Cellules)': 'cellule2', // was not updated, should be changed
              },
            },
            importId,
          })

          const targetEvent = project.pendingEvents.find(
            (item) => item.type === ProjectReimported.type
          ) as ProjectReimported | undefined
          expect(targetEvent).toBeDefined()
          if (!targetEvent) return

          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
          expect(targetEvent.payload.data).toEqual({
            details: { 'Nom du fabricant (Cellules)': 'cellule2' },
          })
        })
      })
      describe('when project had a previous ProjectDataCorrected', () => {
        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: [
              new LegacyProjectSourced({
                payload: {
                  projectId: projectId.toString(),
                  periodeId,
                  appelOffreId,
                  familleId,
                  numeroCRE,
                  potentielIdentifier: '',
                  content: {
                    ...fakeProject,
                    nomCandidat: '123',
                    prixReference: 1,
                  },
                },
              }),
              new ProjectDataCorrected({
                payload: {
                  projectId: projectId.toString(),
                  correctedData: {
                    nomCandidat: '456',
                  },
                  correctedBy: '',
                },
              }),
            ],
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          })
        )

        it('should ignore the changes on the fields that were corrected', () => {
          project.import({
            data: {
              ...fakeProject,
              nomCandidat: '678',
              prixReference: 4,
            },
            importId,
          })

          const targetEvent = project.pendingEvents.find(
            (item) => item.type === ProjectReimported.type
          ) as ProjectReimported | undefined
          expect(targetEvent).toBeDefined()
          if (!targetEvent) return

          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
          expect(targetEvent.payload.data).toEqual({
            prixReference: 4,
          })
        })
      })
    })

    describe('when data contains a notification date', () => {
      const data = { ...fakeProject, notifiedOn: new Date('2020-01-01').getTime() }

      describe('when the project changed from éliminé to classé', () => {
        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: [
              new LegacyProjectSourced({
                payload: {
                  projectId: projectId.toString(),
                  periodeId,
                  appelOffreId,
                  familleId,
                  numeroCRE,
                  potentielIdentifier: '',
                  content: { ...data, classe: 'Eliminé' },
                },
              }),
            ],
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          })
        )

        beforeAll(() => {
          project.import({ data: { ...data, classe: 'Classé' }, importId })
        })

        it('should emit GF/DCR/CompletionDueDateSet', () => {
          expect(project.pendingEvents).toHaveLength(5)

          const pendingEventTypes = project.pendingEvents.map((item) => item.type)
          expect(pendingEventTypes).toContain('ProjectGFDueDateSet')
          expect(pendingEventTypes).toContain('ProjectDCRDueDateSet')
          expect(pendingEventTypes).toContain('ProjectCompletionDueDateSet')
        })

        it('should emit ProjectCertificateObsolete', () => {
          const targetEvent = findEventOfType(ProjectCertificateObsolete, project.pendingEvents)
          expect(targetEvent).toBeDefined()
          if (!targetEvent) return

          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
        })
      })

      describe('when the project remains classé', () => {
        describe('when the notification date has changed', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: [
                new LegacyProjectSourced({
                  payload: {
                    projectId: projectId.toString(),
                    periodeId,
                    appelOffreId,
                    familleId,
                    numeroCRE,
                    potentielIdentifier: '',
                    content: {
                      ...data,
                      notifiedOn: new Date('2020-01-01').getTime(),
                      classe: 'Classé',
                    },
                  },
                }),
              ],
              getProjectAppelOffre,
              buildProjectIdentifier: () => '',
            })
          )

          it('should emit GF/DCR/CompletionDueDateSet', () => {
            project.import({
              data: { ...data, classe: 'Classé', notifiedOn: new Date('2020-01-02').getTime() },
              importId,
            })

            expect(project.pendingEvents).toHaveLength(4)

            const pendingEventTypes = project.pendingEvents.map((item) => item.type)
            expect(pendingEventTypes).toContain('ProjectGFDueDateSet')
            expect(pendingEventTypes).toContain('ProjectDCRDueDateSet')
            expect(pendingEventTypes).toContain('ProjectCompletionDueDateSet')
          })
        })

        describe('when the notification date has not changed', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: [
                new LegacyProjectSourced({
                  payload: {
                    projectId: projectId.toString(),
                    periodeId,
                    appelOffreId,
                    familleId,
                    numeroCRE,
                    potentielIdentifier: '',
                    content: {
                      ...data,
                      classe: 'Classé',
                    },
                  },
                }),
              ],
              getProjectAppelOffre,
              buildProjectIdentifier: () => '',
            })
          )

          it('should not emit', () => {
            project.import({
              data: { ...data, classe: 'Classé' },
              importId,
            })

            expect(project.pendingEvents).toHaveLength(0)
          })
        })
      })

      describe('when the project remains éliminé', () => {
        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: [
              new LegacyProjectSourced({
                payload: {
                  projectId: projectId.toString(),
                  periodeId,
                  appelOffreId,
                  familleId,
                  numeroCRE,
                  potentielIdentifier: '',
                  content: {
                    ...data,
                    classe: 'Eliminé',
                  },
                },
              }),
            ],
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          })
        )

        it('should not emit', () => {
          project.import({
            data: { ...data, classe: 'Eliminé' },
            importId,
          })

          expect(project.pendingEvents).toHaveLength(0)
        })
      })

      describe('when the project changed from classé to éliminé', () => {
        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: [
              new LegacyProjectSourced({
                payload: {
                  projectId: projectId.toString(),
                  periodeId,
                  appelOffreId,
                  familleId,
                  numeroCRE,
                  potentielIdentifier: '',
                  content: {
                    ...data,
                    classe: 'Classé',
                  },
                },
              }),
            ],
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          })
        )

        beforeAll(() => {
          project.import({
            data: { ...data, classe: 'Eliminé' },
            importId,
          })
        })

        it('should emit GF/DCR/CompletionDueDateCancelled', () => {
          expect(project.pendingEvents).toHaveLength(5)

          const pendingEventTypes = project.pendingEvents.map((item) => item.type)
          expect(pendingEventTypes).toContain('ProjectGFDueDateCancelled')
          expect(pendingEventTypes).toContain('ProjectDCRDueDateCancelled')
          expect(pendingEventTypes).toContain('ProjectCompletionDueDateCancelled')
        })

        it('should emit ProjectCertificateObsolete', () => {
          const targetEvent = findEventOfType(ProjectCertificateObsolete, project.pendingEvents)
          expect(targetEvent).toBeDefined()
          if (!targetEvent) return

          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
        })
      })

      describe('when project was already notified', () => {
        describe('when the notification date has not changed', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: [
                new LegacyProjectSourced({
                  payload: {
                    projectId: projectId.toString(),
                    periodeId,
                    appelOffreId,
                    familleId,
                    numeroCRE,
                    potentielIdentifier: '',
                    content: {
                      ...data,
                      notifiedOn: new Date('2020-01-01').getTime(),
                    },
                  },
                }),
              ],
              getProjectAppelOffre,
              buildProjectIdentifier: () => '',
            })
          )
          it('should not emit', () => {
            project.import({
              data: { ...data, notifiedOn: new Date('2020-01-01').getTime() },
              importId,
            })

            expect(project.pendingEvents).toHaveLength(0)
          })
        })

        describe('when the notification date has changed"', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: [
                new LegacyProjectSourced({
                  payload: {
                    projectId: projectId.toString(),
                    periodeId,
                    appelOffreId,
                    familleId,
                    numeroCRE,
                    potentielIdentifier: '',
                    content: {
                      ...data,
                      notifiedOn: new Date('2020-01-01').getTime(),
                    },
                  },
                }),
              ],
              getProjectAppelOffre,
              buildProjectIdentifier: () => '',
            })
          )
          it('should emit ProjectNotificationDateSet', () => {
            project.import({
              data: { ...data, notifiedOn: new Date('2020-01-02').getTime() },
              importId,
            })

            const targetEvent = findEventOfType(ProjectNotificationDateSet, project.pendingEvents)
            expect(targetEvent).toBeDefined()
            if (!targetEvent) return
            expect(targetEvent.payload.projectId).toEqual(projectId.toString())
            expect(targetEvent.payload.notifiedOn).toEqual(new Date('2020-01-02').getTime())
          })
        })
      })

      describe('when the project was not notified', () => {
        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: [
              new LegacyProjectSourced({
                payload: {
                  projectId: projectId.toString(),
                  periodeId,
                  appelOffreId,
                  familleId,
                  numeroCRE,
                  potentielIdentifier: '',
                  content: {
                    ...data,
                    notifiedOn: 0,
                  },
                },
              }),
            ],
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          })
        )
        it('should emit ProjectNotificationDateSet', () => {
          project.import({
            data: { ...data, notifiedOn: new Date('2020-01-02').getTime() },
            importId,
          })

          const targetEvent = findEventOfType(ProjectNotificationDateSet, project.pendingEvents)
          expect(targetEvent).toBeDefined()
          if (!targetEvent) return
          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
          expect(targetEvent.payload.notifiedOn).toEqual(new Date('2020-01-02').getTime())
        })
      })
    })
  })
})
