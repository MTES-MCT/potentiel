import _ from 'lodash'
import moment from 'moment-timezone'
import { DomainEvent } from '../core/domain'
import { logger, okAsync } from '../core/utils'
import { appelOffreRepo, appelsOffreStatic } from '../dataAccess/inMemory'
import { makeProject, Project } from '../entities'
import { EventBus } from '../modules/eventStore'
import { ProjectImported, ProjectReimported } from '../modules/project'
import { LegacyModificationImported } from '../modules/modificationRequest'
import { InfraNotAvailableError } from '../modules/shared'
import { Ok, UnwrapForTest } from '../types'
import makeFakeProject from '../__tests__/fixtures/project'
import makeImportProjects, { ERREUR_AUCUNE_LIGNE, ERREUR_FORMAT_LIGNE } from './importProjects'

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
    logger.error(`importProjects test, getColumnForField missing column for field:  ${field}`)
  return dataField ? dataField.column : 'missing-' + field
}

const makePhonyLine = () => ({
  "Appel d'offres": phonyAppelOffre.id,
  Période: phonyPeriodId,
  Famille: phonyFamilleId,
  [getColumnForField('numeroCRE')]: phonyNumeroCRE,
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

const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null))

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

  describe('when the appel offre requires a famille', () => {
    describe('when a line doesn‘t have a familleId', () => {
      it('should throw an error', async () => {
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

        const badLine = _.omit(makePhonyLine(), 'Famille')

        const result = await importProjects({
          lines: [badLine],
          userId: 'userId',
        })

        expect(result.is_err()).toBe(true)
        expect(result.unwrap_err().message.indexOf(ERREUR_FORMAT_LIGNE)).toEqual(0)

        expect(findOneProject).not.toHaveBeenCalled()
        expect(saveProject).not.toHaveBeenCalled()
        expect(addProjectToUserWithEmail).not.toHaveBeenCalled()
      })
    })

    describe('when a line doesn‘t have a valid familleId', () => {
      it('should throw an error', async () => {
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

        const badLine = { ...makePhonyLine(), Famille: 'abc' }

        const result = await importProjects({
          lines: [badLine],
          userId: 'userId',
        })

        expect(result.is_err()).toBe(true)
        expect(result.unwrap_err().message.indexOf(ERREUR_FORMAT_LIGNE)).toEqual(0)

        expect(findOneProject).not.toHaveBeenCalled()
        expect(saveProject).not.toHaveBeenCalled()
        expect(addProjectToUserWithEmail).not.toHaveBeenCalled()
      })
    })
  })

  describe('when the appel offre doesn‘t require a famille and familleId is not provided', () => {
    const goodLine = {
      ...makePhonyLine(),
      "Appel d'offres": 'CRE4 - Autoconsommation ZNI',
      Période: '1',
      Famille: undefined,
    }
    it('should not throw an error', async () => {
      const findOneProject = jest.fn()
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

      const result = await importProjects({
        lines: [goodLine],
        userId: 'userId',
      })

      if (result.is_err()) console.log(result.unwrap_err().message)
      expect(result.is_ok()).toBe(true)
    })
  })

  describe('when line contains a legacy modification', () => {
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

    describe('when line has a single Abandon modification', () => {
      const phonyLine = {
        ...makePhonyLine(),
        'Type de modification 1': 'Abandon',
        'Date de modification 1': '25/04/2019',
        'Colonne concernée 1': '',
        'Ancienne valeur 1': '',
      }

      beforeAll(async () => {
        fakePublish.mockClear()
        saveProject.mockClear()

        const result = await importProjects({
          lines: [phonyLine],
          userId: 'userId',
        })

        if (result.is_err()) {
          console.log(result.unwrap_err())
        }
        expect(result.is_ok()).toBeTruthy()
      })

      it('should trigger a LegacyModificationImported event of type abandon', async () => {
        const newProject = saveProject.mock.calls[0][0]
        expect(newProject).toBeDefined()
        const projectId = newProject.id

        expect(fakePublish).toHaveBeenCalled()
        const targetEvent = fakePublish.mock.calls
          .map((call) => call[0])
          .find(
            (event) => event.type === LegacyModificationImported.type
          ) as LegacyModificationImported

        expect(targetEvent).toBeDefined()
        if (!targetEvent) return
        expect(targetEvent.payload).toMatchObject({
          type: 'abandon',
          projectId,
          modifiedOn: 1556143200000,
        })
      })
    })

    describe('when line has a single Recours modification that was rejected', () => {
      const phonyLine = {
        ...makePhonyLine(),
        'Type de modification 1': 'Recours gracieux',
        'Date de modification 1': '25/04/2019',
        'Colonne concernée 1': 'Classé ?',
        'Ancienne valeur 1': 'Eliminé',
      }

      beforeAll(async () => {
        fakePublish.mockClear()
        saveProject.mockClear()

        const result = await importProjects({
          lines: [phonyLine],
          userId: 'userId',
        })

        if (result.is_err()) {
          console.log(result.unwrap_err())
        }
        expect(result.is_ok()).toBeTruthy()
      })

      it('should trigger a LegacyModificationImported event of type recours and rejected', async () => {
        const newProject = saveProject.mock.calls[0][0]
        expect(newProject).toBeDefined()
        const projectId = newProject.id

        expect(fakePublish).toHaveBeenCalled()
        const targetEvent = fakePublish.mock.calls
          .map((call) => call[0])
          .find(
            (event) => event.type === LegacyModificationImported.type
          ) as LegacyModificationImported

        expect(targetEvent).toBeDefined()
        if (!targetEvent) return
        expect(targetEvent.payload).toMatchObject({
          type: 'recours',
          accepted: false,
          projectId,
          modifiedOn: 1556143200000,
        })
      })
    })
    describe('when line has a single Recours modification that was accepted', () => {
      const phonyLine = {
        ...makePhonyLine(),
        'Type de modification 1': 'Recours gracieux',
        'Date de modification 1': '25/04/2019',
        'Colonne concernée 1': 'Classé ?',
        'Ancienne valeur 1': 'Classé',
      }

      beforeAll(async () => {
        fakePublish.mockClear()
        saveProject.mockClear()

        const result = await importProjects({
          lines: [phonyLine],
          userId: 'userId',
        })

        if (result.is_err()) {
          console.log(result.unwrap_err())
        }
        expect(result.is_ok()).toBeTruthy()
      })

      it('should trigger a LegacyModificationImported event of type recours and accepted', async () => {
        const newProject = saveProject.mock.calls[0][0]
        expect(newProject).toBeDefined()
        const projectId = newProject.id

        expect(fakePublish).toHaveBeenCalled()
        const targetEvent = fakePublish.mock.calls
          .map((call) => call[0])
          .find(
            (event) => event.type === LegacyModificationImported.type
          ) as LegacyModificationImported

        expect(targetEvent).toBeDefined()
        if (!targetEvent) return
        expect(targetEvent.payload).toMatchObject({
          type: 'recours',
          accepted: true,
          projectId,
          modifiedOn: 1556143200000,
        })
      })
    })

    describe('when line has a single Recours modification that was accepted and contains the previous motifElimination', () => {
      const phonyLine = {
        ...makePhonyLine(),
        'Type de modification 1': 'Recours gracieux',
        'Date de modification 1': '25/04/2019',
        'Colonne concernée 1': 'Classé ?',
        'Ancienne valeur 1': 'Classé',
        'Type de modification 2': 'Recours gracieux',
        'Date de modification 2': '25/04/2019',
        'Colonne concernée 2': "Motif d'élimination",
        'Ancienne valeur 2': 'Ancien motif',
      }

      beforeAll(async () => {
        fakePublish.mockClear()
        saveProject.mockClear()

        const result = await importProjects({
          lines: [phonyLine],
          userId: 'userId',
        })

        if (result.is_err()) {
          console.log(result.unwrap_err())
        }
        expect(result.is_ok()).toBeTruthy()
      })

      it('should trigger a LegacyModificationImported event of type recours, accepted and contain the previous motifs', async () => {
        const newProject = saveProject.mock.calls[0][0]
        expect(newProject).toBeDefined()
        const projectId = newProject.id

        expect(fakePublish).toHaveBeenCalled()
        const targetEvent = fakePublish.mock.calls
          .map((call) => call[0])
          .find(
            (event) => event.type === LegacyModificationImported.type
          ) as LegacyModificationImported

        expect(targetEvent).toBeDefined()
        if (!targetEvent) return
        expect(targetEvent.payload).toMatchObject({
          type: 'recours',
          accepted: true,
          projectId,
          motifElimination: 'Ancien motif',
          modifiedOn: 1556143200000,
        })
      })
    })

    describe('when line has a single Prolongation de délai modification', () => {
      const phonyLine = {
        ...makePhonyLine(),
        'Type de modification 1': 'Prolongation de délai',
        'Date de modification 1': '25/04/2019',
        'Colonne concernée 1': '22/12/2024',
        'Ancienne valeur 1': '01/01/2024',
      }

      beforeAll(async () => {
        fakePublish.mockClear()
        saveProject.mockClear()

        const result = await importProjects({
          lines: [phonyLine],
          userId: 'userId',
        })

        if (result.is_err()) {
          console.log(result.unwrap_err())
        }
        expect(result.is_ok()).toBeTruthy()
      })

      it('should trigger a LegacyModificationImported event of type delai with the proper dates', async () => {
        const newProject = saveProject.mock.calls[0][0]
        expect(newProject).toBeDefined()
        const projectId = newProject.id

        expect(fakePublish).toHaveBeenCalled()
        const targetEvent = fakePublish.mock.calls
          .map((call) => call[0])
          .find(
            (event) => event.type === LegacyModificationImported.type
          ) as LegacyModificationImported

        expect(targetEvent).toBeDefined()
        if (!targetEvent) return
        expect(targetEvent.payload).toMatchObject({
          type: 'delai',
          nouvelleDateLimiteAchevement: 1734822000000,
          ancienneDateLimiteAchevement: 1704063600000,
          projectId,
          modifiedOn: 1556143200000,
        })
      })
    })

    describe('when line has a Actionnaire modification', () => {
      const phonyLine = {
        ...makePhonyLine(),
        'Type de modification 1': "Changement d'actionnaire",
        'Date de modification 1': '25/04/2019',
        'Colonne concernée 1': 'Candidat',
        'Ancienne valeur 1': 'ancien candidat',
        'Type de modification 2': "Changement d'actionnaire",
        'Date de modification 2': '25/04/2019',
        'Colonne concernée 2': 'Numéro SIREN ou SIRET*',
        'Ancienne valeur 2': 'ancien siret',
      }

      beforeAll(async () => {
        fakePublish.mockClear()
        saveProject.mockClear()

        const result = await importProjects({
          lines: [phonyLine],
          userId: 'userId',
        })

        if (result.is_err()) {
          console.log(result.unwrap_err())
        }
        expect(result.is_ok()).toBeTruthy()
      })

      it('should trigger a LegacyModificationImported event of type actionnaire with ancien actionnaire and ancien siret', async () => {
        const newProject = saveProject.mock.calls[0][0]
        expect(newProject).toBeDefined()
        const projectId = newProject.id

        expect(fakePublish).toHaveBeenCalled()
        const targetEvent = fakePublish.mock.calls
          .map((call) => call[0])
          .find(
            (event) => event.type === LegacyModificationImported.type
          ) as LegacyModificationImported

        expect(targetEvent).toBeDefined()
        if (!targetEvent) return
        expect(targetEvent.payload).toMatchObject({
          type: 'actionnaire',
          actionnairePrecedent: 'ancien candidat',
          siretPrecedent: 'ancien siret',
          projectId,
          modifiedOn: 1556143200000,
        })
      })
    })

    describe('when line has a Producteur modification', () => {
      const phonyLine = {
        ...makePhonyLine(),
        'Type de modification 1': 'Changement de producteur',
        'Date de modification 1': '25/04/2019',
        'Colonne concernée 1': 'Nom (personne physique) ou raison sociale (personne morale) : ',
        'Ancienne valeur 1': 'ancien producteur',
      }

      beforeAll(async () => {
        fakePublish.mockClear()
        saveProject.mockClear()

        const result = await importProjects({
          lines: [phonyLine],
          userId: 'userId',
        })

        if (result.is_err()) {
          console.log(result.unwrap_err())
        }
        expect(result.is_ok()).toBeTruthy()
      })

      it('should trigger a LegacyModificationImported event of type producteur with ancien producteur', async () => {
        const newProject = saveProject.mock.calls[0][0]
        expect(newProject).toBeDefined()
        const projectId = newProject.id

        expect(fakePublish).toHaveBeenCalled()
        const targetEvent = fakePublish.mock.calls
          .map((call) => call[0])
          .find(
            (event) => event.type === LegacyModificationImported.type
          ) as LegacyModificationImported

        expect(targetEvent).toBeDefined()
        if (!targetEvent) return
        expect(targetEvent.payload).toMatchObject({
          type: 'producteur',
          producteurPrecedent: 'ancien producteur',
          projectId,
          modifiedOn: 1556143200000,
        })
      })
    })

    describe('when line has a multiple modifications', () => {
      const phonyLine = {
        ...makePhonyLine(),
        'Type de modification 1': 'Changement de producteur',
        'Date de modification 1': '25/04/2019',
        'Colonne concernée 1': 'Nom (personne physique) ou raison sociale (personne morale) : ',
        'Ancienne valeur 1': 'ancien producteur',
        'Type de modification 2': 'Prolongation de délai',
        'Date de modification 2': '26/04/2019',
        'Colonne concernée 2': '22/12/2024',
        'Ancienne valeur 2': '01/01/2024',
        'Type de modification 3': 'Recours gracieux',
        'Date de modification 3': '27/04/2019',
        'Colonne concernée 3': 'Classé ?',
        'Ancienne valeur 3': 'Eliminé',
      }

      beforeAll(async () => {
        fakePublish.mockClear()
        saveProject.mockClear()

        const result = await importProjects({
          lines: [phonyLine],
          userId: 'userId',
        })

        if (result.is_err()) {
          console.log(result.unwrap_err())
        }
        expect(result.is_ok()).toBeTruthy()
      })

      it('should trigger a LegacyModificationImported event for each modification', async () => {
        const newProject = saveProject.mock.calls[0][0]
        expect(newProject).toBeDefined()
        const projectId = newProject.id

        expect(fakePublish).toHaveBeenCalled()
        const targetEvents = fakePublish.mock.calls
          .map((call) => call[0])
          .filter(
            (event) => event.type === LegacyModificationImported.type
          ) as LegacyModificationImported[]

        expect(targetEvents).toHaveLength(3)
        expect(targetEvents.some((event) => event.payload.type === 'producteur')).toBe(true)
        expect(targetEvents.some((event) => event.payload.type === 'delai')).toBe(true)
        expect(targetEvents.some((event) => event.payload.type === 'recours')).toBe(true)
      })
    })

    describe('when line has an illegal modification type', () => {
      const phonyLine = {
        ...makePhonyLine(),
        'Type de modification 1': 'This does not exist',
        'Date de modification 1': '25/04/2019',
        'Colonne concernée 1': '',
        'Ancienne valeur 1': '',
      }

      beforeAll(async () => {})

      it('should return an error', async () => {
        fakePublish.mockClear()
        saveProject.mockClear()

        const result = await importProjects({
          lines: [phonyLine],
          userId: 'userId',
        })

        expect(result.is_err()).toBeTruthy()
        expect(result.unwrap_err().message).toContain("Type de modification 1 n'est pas reconnu")
      })
    })
  })
})
