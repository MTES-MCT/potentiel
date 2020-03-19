import makeImportProjects, {
  MANDATORY_HEADER_COLUMNS,
  ERREUR_COLONNES,
  ERREUR_PERIODE,
  ERREUR_AUCUNE_LIGNE,
  ERREUR_FORMAT_LIGNE,
  ERREUR_INSERTION
} from './importProjects'

import { projectRepo } from '../dataAccess/inMemory'

const importProjects = makeImportProjects({ projectRepo })

const makePhonyLine = () => ({
  numeroCRE: 'numeroCRE',
  famille: 'famille',
  nomCandidat: 'nomCandidat',
  nomProjet: 'nomProjet',
  'puissance(kWc)': '11,5',
  'prixReference(euros/MWh)': '100',
  'evaluationCarbone(kg eq CO2/kWc)': '142.5',
  note: '11',
  nomRepresentantLegal: 'nomRepresentantLegal',
  email: 'email@address.com',
  adresseProjet: 'adresseProjet',
  codePostalProjet: 'codePostalProjet',
  communeProjet: 'communeProjet',
  departementProjet: 'departementProjet',
  regionProjet: 'regionProjet',
  'classé(1/0)': 'Classé',
  motifsElimination: 'motifsElimination'
})

describe('importProjects use-case', () => {
  it('should throw an error if the periode is missing', async () => {
    const result = await importProjects({
      periode: '',
      headers: MANDATORY_HEADER_COLUMNS,
      lines: []
    })

    expect(result.is_err())
    expect(result.unwrap_err().message).toEqual(ERREUR_PERIODE)
  })

  it('should throw an error if the headers are not correct', async () => {
    const result = await importProjects({
      periode: 'periode',
      headers: ['bim', 'bam', 'boum'],
      lines: []
    })

    expect(result.is_err())
    expect(result.unwrap_err().message).toEqual(ERREUR_COLONNES)
  })

  it("should throw an error if there isn't at least one line", async () => {
    const result = await importProjects({
      periode: 'periode',
      headers: MANDATORY_HEADER_COLUMNS,
      lines: []
    })

    expect(result.is_err())
    expect(result.unwrap_err().message).toEqual(ERREUR_AUCUNE_LIGNE)
  })

  it("should throw an error if some lines don't have the required fields", async () => {
    const goodLine = makePhonyLine()
    // create a bad line by removing a required field
    const { nomCandidat, ...badLine } = goodLine

    const result = await importProjects({
      periode: 'periode',
      headers: MANDATORY_HEADER_COLUMNS,
      lines: [goodLine, badLine]
    })

    expect(result.is_err())
    expect(result.unwrap_err().message.indexOf(ERREUR_FORMAT_LIGNE)).toEqual(0)
  })

  it('inserts all given projects to the store', async () => {
    const priorProjects = await projectRepo.findAll()

    expect(priorProjects).toHaveLength(0)

    const phonyLine = makePhonyLine()
    const phonyPeriode = 'periode 1'
    await importProjects({
      periode: phonyPeriode,
      headers: MANDATORY_HEADER_COLUMNS,
      lines: [phonyLine]
    })

    const newProjects = await projectRepo.findAll()

    // What is expected is the same as the phonyLine
    // but with numbers instead of strings
    // and project entity property names
    const expectedLine = {
      periode: phonyPeriode,
      numeroCRE: 'numeroCRE',
      famille: 'famille',
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
      classe: 'Classé',
      motifsElimination: 'motifsElimination'
    }

    expect(newProjects).toHaveLength(1)
    expect(newProjects).toContainEqual(expect.objectContaining(expectedLine))
  })
})
