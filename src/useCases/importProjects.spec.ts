import _ from 'lodash'
import moment from 'moment'
import { appelOffreRepo, appelsOffreStatic } from '../dataAccess/inMemory'
import { makeProject, Project } from '../entities'
import { UnwrapForTest, Ok } from '../types'
import makeFakeProject from '../__tests__/fixtures/project'
import makeImportProjects, {
  ERREUR_AUCUNE_LIGNE,
  ERREUR_FORMAT_LIGNE,
} from './importProjects'

const phonyAppelOffre = appelsOffreStatic[0]
const phonyPeriodId = phonyAppelOffre.periodes[0].id
const phonyNumeroCRE = '1'
const phonyFamilleId = '1'
const phonyNotifiedOnDate = '22/04/2020'

const getColumnForField = (field: string) => {
  const dataField = phonyAppelOffre.dataFields.find(
    (item) => item.field === field
  )
  if (!dataField)
    console.log(
      'importProjects test, getColumnForField missing column for field',
      field
    )
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
  [getColumnForField('email')]: 'email@address.com',
  [getColumnForField('adresseProjet')]: 'adresseProjet',
  [getColumnForField('codePostalProjet')]: '01234',
  [getColumnForField('communeProjet')]: 'communeProjet',
  [getColumnForField('fournisseur')]: 'fournisseur',
  [getColumnForField('classe')]: 'Classé',
  [getColumnForField('motifsElimination')]: '',
  [getColumnForField('notifiedOn')]: phonyNotifiedOnDate,
  autreColonne: 'valeurAutreColonne',
})

describe('importProjects use-case', () => {
  describe('when the imported project is new', () => {
    it('creates a new project', async () => {
      const saveProject = jest.fn(async (project: Project) => Ok(project))
      const removeProject = jest.fn()

      const importProjects = makeImportProjects({
        findOneProject: jest.fn(async () => undefined),
        saveProject,
        removeProject,
        appelOffreRepo,
      })

      const phonyLine = makePhonyLine()
      const result = await importProjects({
        lines: [phonyLine],
        userId: 'userId',
      })

      expect(result.is_ok()).toBeTruthy()

      if (result.is_err()) {
        console.log('importProject returned error', result.unwrap_err())
        return
      }

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
        notifiedOn: moment(phonyNotifiedOnDate, 'DD/MM/YYYY')
          .toDate()
          .getTime(),
        // special column for all the "other columns" that are not in the project schema
        details: {
          autreColonne: 'valeurAutreColonne',
        },
      }

      expect(saveProject).toHaveBeenCalledTimes(1)
      expect(saveProject).toHaveBeenCalledWith(
        expect.objectContaining(expectedLine)
      )

      // Make sure a history item has been created
      const newProject = saveProject.mock.calls[0][0]
      expect(newProject).toBeDefined()

      expect(newProject.history).toHaveLength(1)
      if (!newProject.history || !newProject.history.length) return
      expect(newProject.history[0].before).toEqual({})
      expect(newProject.history[0].after).toEqual({})
      expect(newProject.history[0].type).toEqual('import')
      expect(newProject.history[0].userId).toEqual('userId')
      expect(newProject.history[0].createdAt / 100).toBeCloseTo(
        Date.now() / 100,
        0
      )
    })
  })

  describe('when a project with the same numero CRE, appel offre, periode and famille exists', () => {
    it('should update the existing project fields but not the notification date', async () => {
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
      const saveProject = jest.fn(async (project: Project) => Ok(project))

      const importProjects = makeImportProjects({
        findOneProject,
        saveProject,
        removeProject: jest.fn(),
        appelOffreRepo,
      })

      // Insert line through import
      const phonyLine = makePhonyLine()
      const result = await importProjects({
        lines: [phonyLine],
        userId: 'userId',
      })

      expect(result.is_ok()).toBeTruthy()

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
      expect(updatedProject.history[0].before.nomProjet).toEqual(
        'Ancien nom projet'
      )
      expect(updatedProject.history[0].after.nomProjet).toEqual('nomProjet')
      expect(updatedProject.history[0].type).toEqual('import')
      expect(updatedProject.history[0].userId).toEqual('userId')
      expect(updatedProject.history[0].createdAt / 100).toBeCloseTo(
        Date.now() / 100,
        0
      )
    })
  })

  it("should throw an error if there isn't at least one line", async () => {
    const findOneProject = jest.fn()
    const saveProject = jest.fn()

    const importProjects = makeImportProjects({
      findOneProject,
      saveProject,
      removeProject: jest.fn(),
      appelOffreRepo,
    })

    const result = await importProjects({
      lines: [],
      userId: 'userId',
    })

    expect(result.is_err())
    expect(result.unwrap_err().message).toEqual(ERREUR_AUCUNE_LIGNE)

    expect(findOneProject).not.toHaveBeenCalled()
    expect(saveProject).not.toHaveBeenCalled()
  })

  it("should throw an error if some lines don't have the required fields", async () => {
    const findOneProject = jest.fn()
    const saveProject = jest.fn()

    const importProjects = makeImportProjects({
      findOneProject,
      saveProject,
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

    expect(result.is_err())
    expect(result.unwrap_err().message.indexOf(ERREUR_FORMAT_LIGNE)).toEqual(0)

    expect(findOneProject).not.toHaveBeenCalled()
    expect(saveProject).not.toHaveBeenCalled()
  })
})
