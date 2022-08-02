import { DomainEvent, UniqueEntityID } from '@core/domain'
import { UnwrapForTest } from '@core/utils'
import { appelsOffreStatic } from '@dataAccess/inMemory'
import makeFakeProject from '../../__tests__/fixtures/project'
import { ProjectImported, ProjectNotified, ProjectDCRSubmitted } from './events'
import { makeProject } from './Project'
import { makeGetProjectAppelOffre } from '@modules/projectAppelOffre'
import { ProjectCannotBeUpdatedIfUnnotifiedError, DCRCertificatDéjàEnvoyéError } from './errors'

const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic)
const projectId = new UniqueEntityID()

const appelOffreId = 'Fessenheim'
const periodeId = '2'
const fakeProject = makeFakeProject({ appelOffreId, periodeId, classe: 'Classé' })
const { familleId, numeroCRE, potentielIdentifier } = fakeProject

describe('Project.submitDemandeComplèteRaccordement()', () => {
  describe(`Quand le projet n'a pas été notifié`, () => {
    it('Alors une erreur de type ProjectCannotBeUpdatedIfUnnotifiedError doit être retournée', () => {
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

      const res = project.submitDemandeComplèteRaccordement({
        projectId: projectId.toString(),
        dcrDate: new Date('2022-01-01'),
        fileId: 'identifiant-fichier',
        numeroDossier: 'numero-dossier',
        submittedBy: 'user-id',
      })
      expect(res.isErr()).toBe(true)
      if (res.isOk()) return
      expect(res.error).toBeInstanceOf(ProjectCannotBeUpdatedIfUnnotifiedError)
    })
  })

  describe('Quand le projet a été notifié', () => {
    describe(`Lorsqu'une DCR a déjà été soumise`, () => {
      it(`Alors une erreur de type DCRCertificatDéjàEnvoyéError doit être retournée`, () => {})

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
        new ProjectDCRSubmitted({
          payload: {
            projectId: projectId.toString(),
            dcrDate: new Date('2022-01-01'),
            fileId: 'identifiant-fichier',
            numeroDossier: 'numero-dossier',
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
          getProjectAppelOffre,
          history: fakeHistory,
          buildProjectIdentifier: () => '',
        })
      )

      const res = project.submitDemandeComplèteRaccordement({
        projectId: projectId.toString(),
        dcrDate: new Date('2022-01-01'),
        fileId: 'identifiant-fichier',
        numeroDossier: 'numero-dossier',
        submittedBy: 'user-id',
      })
      expect(res.isErr()).toBe(true)
      if (res.isOk()) return
      expect(res.error).toBeInstanceOf(DCRCertificatDéjàEnvoyéError)
    })

    describe(`Lorsqu'aucune DCR n'a déjà été soumise`, () => {
      it(`Alors un évènement ProjectDCRSubmitted doit être émis`, () => {})

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

      const project = UnwrapForTest(
        makeProject({
          projectId,
          getProjectAppelOffre,
          history: fakeHistory,
          buildProjectIdentifier: () => '',
        })
      )

      project.submitDemandeComplèteRaccordement({
        projectId: projectId.toString(),
        dcrDate: new Date('2022-01-01'),
        fileId: 'identifiant-fichier',
        numeroDossier: 'numero-dossier',
        submittedBy: 'user-id',
      })

      expect(project.pendingEvents).toHaveLength(1)

      const targetEvent = project.pendingEvents[0]
      if (!targetEvent) return

      expect(targetEvent.type).toEqual(ProjectDCRSubmitted.type)
      expect(targetEvent.payload.projectId).toEqual(projectId.toString())
      expect(targetEvent.payload.fileId).toEqual('identifiant-fichier')
      expect(targetEvent.payload.submittedBy).toEqual('user-id')
      expect(targetEvent.payload.numeroDossier).toEqual('numero-dossier')
    })
  })
})
