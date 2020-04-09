import makeImportProjects, {
  ERREUR_AUCUNE_LIGNE,
  ERREUR_FORMAT_LIGNE,
  ERREUR_INSERTION,
} from './importProjects'
import _ from 'lodash'
import {
  projectRepo,
  appelOffreRepo,
  appelsOffreStatic,
} from '../dataAccess/inMemory'
import hashPassword from '../helpers/hashPassword'
import moment from 'moment'

const importProjects = makeImportProjects({ projectRepo, appelOffreRepo })

const phonyAppelOffre = appelsOffreStatic[0]
const phonyPeriodId = phonyAppelOffre.periodes[0].id

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
  [getColumnForField('appelOffreId')]: phonyAppelOffre.id,
  [getColumnForField('periodeId')]: phonyPeriodId,
  [getColumnForField('numeroCRE')]: 'numeroCRE',
  [getColumnForField('familleId')]: 'famille',
  [getColumnForField('nomCandidat')]: 'nomCandidat',
  [getColumnForField('nomProjet')]: 'nomProjet',
  [getColumnForField('puissance')]: '11,5',
  [getColumnForField('prixReference')]: '100',
  [getColumnForField('evaluationCarbone')]: '142.5',
  [getColumnForField('note')]: '11',
  [getColumnForField('nomRepresentantLegal')]: 'nomRepresentantLegal',
  [getColumnForField('email')]: 'email@address.com',
  [getColumnForField('adresseProjet')]: 'adresseProjet',
  [getColumnForField('codePostalProjet')]: 'codePostalProjet',
  [getColumnForField('communeProjet')]: 'communeProjet',
  [getColumnForField('departementProjet')]: 'departementProjet',
  [getColumnForField('regionProjet')]: 'regionProjet',
  [getColumnForField('fournisseur')]: 'fournisseur',
  [getColumnForField('actionnaire')]: 'actionnaire',
  [getColumnForField('producteur')]: 'producteur',
  [getColumnForField('classe')]: 'Classé',
  [getColumnForField('motifsElimination')]: '',
  [getColumnForField('notifiedOn')]: '22/04/2020',
})

describe('importProjects use-case', () => {
  it("should throw an error if there isn't at least one line", async () => {
    const result = await importProjects({
      lines: [],
    })

    expect(result.is_err())
    expect(result.unwrap_err().message).toEqual(ERREUR_AUCUNE_LIGNE)
  })

  it("should throw an error if some lines don't have the required fields", async () => {
    const goodLine = makePhonyLine()
    // create a bad line by removing a required field
    const badLine = _.omit(goodLine, getColumnForField('nomCandidat'))

    const result = await importProjects({
      lines: [goodLine, badLine],
    })

    expect(result.is_err())
    expect(result.unwrap_err().message.indexOf(ERREUR_FORMAT_LIGNE)).toEqual(0)
  })

  it('inserts all given projects to the store', async () => {
    const priorProjects = await projectRepo.findAll()

    expect(priorProjects).toHaveLength(0)

    const phonyLine = makePhonyLine()
    await importProjects({
      lines: [phonyLine],
    })

    const newProjects = await projectRepo.findAll()

    // What is expected is the same as the phonyLine
    // but with numbers instead of strings
    // and project entity property names
    const expectedLine = {
      appelOffreId: phonyAppelOffre.id,
      periodeId: phonyPeriodId,
      numeroCRE: 'numeroCRE',
      familleId: 'famille',
      nomCandidat: 'nomCandidat',
      nomProjet: 'nomProjet',
      puissance: 11.5,
      prixReference: 100,
      evaluationCarbone: 142.5,
      note: 11,
      nomRepresentantLegal: 'nomRepresentantLegal',
      email: 'email@address.com',
      adresseProjet: 'adresseProjet',
      codePostalProjet: 'codePostalProjet',
      communeProjet: 'communeProjet',
      departementProjet: 'departementProjet',
      regionProjet: 'regionProjet',
      fournisseur: 'fournisseur',
      actionnaire: 'actionnaire',
      producteur: 'producteur',
      classe: 'Classé',
      motifsElimination: '',
      notifiedOn: moment('22/04/2020', 'DD/MM/YYYY').toDate().getTime(),
    }

    expect(newProjects).toHaveLength(1)

    for (const key in expectedLine) {
      expect(newProjects[0][key]).toEqual(expectedLine[key])
    }
  })
})
