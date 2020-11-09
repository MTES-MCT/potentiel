import _ from 'lodash'
import moment from 'moment'

import { appelOffreRepo, appelsOffreStatic } from '../dataAccess/inMemory'
import { makeProject, Project } from '../entities'
import { UnwrapForTest, Ok } from '../types'
import makeFakeProject from '../__tests__/fixtures/project'
import makeImportProjects, { ERREUR_AUCUNE_LIGNE, ERREUR_FORMAT_LIGNE } from './importProjects'
import { ProjectImported, ProjectReimported } from '../modules/project/events'
import { EventBus, StoredEvent } from '../modules/eventStore'
import { okAsync } from '../core/utils'
import { InfraNotAvailableError } from '../modules/shared'

const phonyAppelOffre = appelsOffreStatic.find((appelOffre) => appelOffre.id === 'Fessenheim')

if (!phonyAppelOffre) {
  throw new Error("Impossible de trouver l'appel d'offre Fessenheim")
}
const phonyPeriodId = '2'
const phonyNumeroCRE = '1'
const phonyFamilleId = '1'
const phonyNotifiedOnDate = '22/04/2020'
const phonyEmail = 'Email@Address.com'

const getColumnForField = (field: string) => {
  const dataField = phonyAppelOffre.dataFields.find((item) => item.field === field)
  if (!dataField)
    console.log('importProjects test, getColumnForField missing column for field', field)
  return dataField ? dataField.column : 'missing-' + field
}

const makePhonyLine = () => ({
  "Appel d'offres": phonyAppelOffre.id,
  Période: phonyPeriodId,
  [getColumnForField('numeroCRE')]: phonyNumeroCRE,
  [getColumnForField('familleId')]: phonyFamilleId,
  [getColumnForField('nomCandidat')]: 'nomCandidat',
  [getColumnForField('nomProjet')]: 'nomProjet',
  [getColumnForField('puissance')]: '11,5',
  [getColumnForField('prixReference')]: '100',
  [getColumnForField('evaluationCarbone')]: '142.5',
  [getColumnForField('note')]: '11',
  [getColumnForField('nomRepresentantLegal')]: 'nomRepresentantLegal',
  [getColumnForField('email')]: phonyEmail,
  [getColumnForField('adresseProjet')]: 'adresseProjet',
  [getColumnForField('codePostalProjet')]: '01234',
  [getColumnForField('communeProjet')]: 'communeProjet',
  [getColumnForField('fournisseur')]: 'fournisseur',
  [getColumnForField('classe')]: 'Classé',
  [getColumnForField('motifsElimination')]: '',
  [getColumnForField('notifiedOn')]: phonyNotifiedOnDate,
  autreColonne: 'valeurAutreColonne',
})

const fakePublish = jest.fn((event: StoredEvent) => okAsync<null, InfraNotAvailableError>(null))

const fakeEventBus: EventBus = {
  publish: fakePublish,
  subscribe: jest.fn(),
}

describe('importProjects use-case', () => {
  describe('when the imported project is new', () => {
    const saveProject = jest.fn(async (project: Project) => Ok(null))
    const removeProject = jest.fn()
    const addProjectToUserWithEmail = jest.fn()

    const importProjects = makeImportProjects({
      eventBus: fakeEventBus as EventBus,
      findOneProject: jest.fn(async () => undefined),
      saveProject,
      removeProject,
      addProjectToUserWithEmail,
      appelOffreRepo,
    })

    const phonyLine = makePhonyLine()

    beforeAll(async () => {
      fakePublish.mockClear()

      const result = await importProjects({
        lines: [phonyLine],
        userId: 'userId',
      })

      expect(result.is_ok()).toBeTruthy()
    })

    it('should create a new project', async () => {
      // What is expected is the same as the phonyLine
      // but with numbers instead of strings
      // and project entity property names
      const expectedLine = {
        appelOffreId: phonyAppelOffre.id,
        periodeId: phonyPeriodId,
        numeroCRE: phonyNumeroCRE,
        familleId: phonyFamilleId,
        nomCandidat: 'nomCandidat',
        nomProjet: 'nomProjet',
        puissance: 11.5,
        prixReference: 100,
        evaluationCarbone: 142.5,
        note: 11,
        nomRepresentantLegal: 'nomRepresentantLegal',
        email: 'email@address.com',
        adresseProjet: 'adresseProjet',
        codePostalProjet: '01234',
        communeProjet: 'communeProjet',
        fournisseur: 'fournisseur',
        classe: 'Classé',
        motifsElimination: '',
        notifiedOn: moment(phonyNotifiedOnDate, 'DD/MM/YYYY').toDate().getTime(),
        // special column for all the "other columns" that are not in the project schema
        details: {
          autreColonne: 'valeurAutreColonne',
        },
      }

      expect(saveProject).toHaveBeenCalledTimes(1)
      expect(saveProject).toHaveBeenCalledWith(expect.objectContaining(expectedLine))

      // Make sure a history item has been created
      const newProject = saveProject.mock.calls[0][0]
      expect(newProject).toBeDefined()

      expect(newProject.history).toHaveLength(1)
      if (!newProject.history || !newProject.history.length) return
      expect(newProject.history[0].before).toEqual({})
      expect(newProject.history[0].after).toEqual({})
      expect(newProject.history[0].type).toEqual('import')
      expect(newProject.history[0].userId).toEqual('userId')
      expect(newProject.history[0].createdAt / 100).toBeCloseTo(Date.now() / 100, 0)
    })

    it('should trigger a ProjectImported event', async () => {
      expect(fakePublish).toHaveBeenCalled()
      const targetEvent = fakePublish.mock.calls
        .map((call) => call[0])
        .find((event) => event.type === ProjectImported.type) as ProjectImported

      expect(targetEvent).toBeDefined()
      if (!targetEvent) return
      expect(targetEvent.payload.appelOffreId).toEqual(phonyAppelOffre.id)
      expect(targetEvent.payload.periodeId).toEqual(phonyPeriodId)
      expect(targetEvent.payload.familleId).toEqual(phonyFamilleId)
      expect(targetEvent.payload.numeroCRE).toEqual(phonyNumeroCRE)
      expect(targetEvent.payload.importedBy).toEqual('userId')
      expect(targetEvent.payload.projectId).toEqual(targetEvent.aggregateId)
    })

    it('should add the project to the user with the same email', async () => {
      const newProject = saveProject.mock.calls[0][0]
      expect(newProject).toBeDefined()
      const newProjectId = newProject.id
      expect(newProjectId).toBeDefined()

      expect(addProjectToUserWithEmail).toHaveBeenCalledTimes(1)
      expect(addProjectToUserWithEmail).toHaveBeenCalledWith(newProjectId, phonyEmail.toLowerCase())
    })
  })

  describe('when a project with the same numero CRE, appel offre, periode and famille exists', () => {
    // Create a fake project
    const existingProject = UnwrapForTest(
      makeProject(
        makeFakeProject({
          appelOffreId: phonyAppelOffre.id,
          periodeId: phonyPeriodId,
          numeroCRE: phonyNumeroCRE,
          familleId: phonyFamilleId,
          nomProjet: 'Ancien nom projet',
          notifiedOn: 0,
        })
      )
    )

    const findOneProject = jest.fn(async () => existingProject)
    const saveProject = jest.fn(async (project: Project) => Ok(null))
    const addProjectToUserWithEmail = jest.fn()

    const importProjects = makeImportProjects({
      eventBus: fakeEventBus,
      findOneProject,
      saveProject,
      addProjectToUserWithEmail,
      removeProject: jest.fn(),
      appelOffreRepo,
    })

    beforeAll(async () => {
      fakePublish.mockClear()

      // Insert line through import
      const phonyLine = makePhonyLine()
      const result = await importProjects({
        lines: [phonyLine],
        userId: 'userId',
      })

      expect(result.is_ok()).toBeTruthy()
    })

    it('should update the existing project fields but not the notification date', async () => {
      expect(findOneProject).toHaveBeenCalledWith({
        appelOffreId: phonyAppelOffre.id,
        periodeId: phonyPeriodId,
        numeroCRE: phonyNumeroCRE,
        familleId: phonyFamilleId,
      })

      expect(saveProject).toHaveBeenCalledTimes(1)

      // Make sure the project has been updated
      const updatedProject = saveProject.mock.calls[0][0]
      expect(updatedProject).toBeDefined()

      expect(updatedProject.nomProjet).toEqual('nomProjet')
      expect(updatedProject.notifiedOn).toEqual(0)

      // Make sure a history event has been added
      expect(updatedProject.history).toHaveLength(1)
      if (!updatedProject.history || !updatedProject.history.length) return
      expect(updatedProject.history[0].before.nomProjet).toEqual('Ancien nom projet')
      expect(updatedProject.history[0].after.nomProjet).toEqual('nomProjet')
      expect(updatedProject.history[0].type).toEqual('import')
      expect(updatedProject.history[0].userId).toEqual('userId')
      expect(updatedProject.history[0].createdAt / 100).toBeCloseTo(Date.now() / 100, 0)
    })

    it('should trigger a ProjectReimported event', async () => {
      expect(fakePublish).toHaveBeenCalled()
      const targetEvent = fakePublish.mock.calls
        .map((call) => call[0])
        .find((event) => event.type === ProjectReimported.type) as ProjectReimported

      expect(targetEvent).toBeDefined()
      if (!targetEvent) return
      expect(targetEvent.payload.importedBy).toEqual('userId')
      expect(targetEvent.payload.projectId).toEqual(existingProject.id)
      expect(targetEvent.aggregateId).toEqual(existingProject.id)
    })

    it('should add the project to the user with the same email', async () => {
      const newProject = saveProject.mock.calls[0][0]
      expect(newProject).toBeDefined()
      const newProjectId = newProject.id
      expect(newProjectId).toBeDefined()

      expect(addProjectToUserWithEmail).toHaveBeenCalledTimes(1)
      expect(addProjectToUserWithEmail).toHaveBeenCalledWith(newProjectId, phonyEmail.toLowerCase())
    })
  })

  it("should throw an error if there isn't at least one line", async () => {
    const findOneProject = jest.fn()
    const saveProject = jest.fn()
    const addProjectToUserWithEmail = jest.fn()

    const importProjects = makeImportProjects({
      eventBus: fakeEventBus,
      findOneProject,
      saveProject,
      addProjectToUserWithEmail,
      removeProject: jest.fn(),
      appelOffreRepo,
    })

    const result = await importProjects({
      lines: [],
      userId: 'userId',
    })

    expect(result.is_err()).toBe(true)
    expect(result.unwrap_err().message).toEqual(ERREUR_AUCUNE_LIGNE)

    expect(findOneProject).not.toHaveBeenCalled()
    expect(saveProject).not.toHaveBeenCalled()
    expect(addProjectToUserWithEmail).not.toHaveBeenCalled()
  })

  it("should throw an error if some lines don't have the required fields", async () => {
    const findOneProject = jest.fn()
    const saveProject = jest.fn()
    const addProjectToUserWithEmail = jest.fn()

    const importProjects = makeImportProjects({
      eventBus: fakeEventBus,
      findOneProject,
      saveProject,
      addProjectToUserWithEmail,
      removeProject: jest.fn(),
      appelOffreRepo,
    })

    const goodLine = makePhonyLine()
    // create a bad line by removing a required field
    const badLine = _.omit(goodLine, getColumnForField('nomCandidat'))

    const result = await importProjects({
      lines: [goodLine, badLine],
      userId: 'userId',
    })

    expect(result.is_err()).toBe(true)
    expect(result.unwrap_err().message.indexOf(ERREUR_FORMAT_LIGNE)).toEqual(0)

    expect(findOneProject).not.toHaveBeenCalled()
    expect(saveProject).not.toHaveBeenCalled()
    expect(addProjectToUserWithEmail).not.toHaveBeenCalled()
  })
})
