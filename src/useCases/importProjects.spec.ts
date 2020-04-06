import makeImportProjects, {
  ERREUR_AUCUNE_LIGNE,
  ERREUR_FORMAT_LIGNE,
  ERREUR_INSERTION
} from './importProjects'

import { projectRepo, appelOffreRepo } from '../dataAccess/inMemory'

const importProjects = makeImportProjects({ projectRepo, appelOffreRepo })

const makePhonyLine = () => ({
  "Appel d'offres": 'fessenheim',
  Période: '6',
  'N°CRE': 'numeroCRE',
  'Famille de candidature': 'famille',
  Candidat: 'nomCandidat',
  'Nom projet': 'nomProjet',
  'Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)':
    '11,5',
  'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)':
    '100',
  'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
    '142.5',
  'Note totale': '11',
  'Nom (personne physique) ou raison sociale (personne morale) :':
    'nomRepresentantLegal',
  'Adresse électronique du contact': 'email@address.com',
  'N°, voie, lieu-dit': 'adresseProjet',
  CP: 'codePostalProjet',
  Commune: 'communeProjet',
  Département: 'departementProjet',
  Région: 'regionProjet',
  'Classé ?': 'Classé',
  "Motif d'élimination": 'motifsElimination',
  'Nom du fabricant (Modules ou films)': 'fournisseur',
  'Nom et prénom du représentant légal': 'actionnaire producteur',
  Notification: '22/04/2020'
})

describe('importProjects use-case', () => {
  it("should throw an error if there isn't at least one line", async () => {
    const result = await importProjects({
      lines: []
    })

    expect(result.is_err())
    expect(result.unwrap_err().message).toEqual(ERREUR_AUCUNE_LIGNE)
  })

  it("should throw an error if some lines don't have the required fields", async () => {
    const goodLine = makePhonyLine()
    // create a bad line by removing a required field
    const { Candidat, ...badLine } = goodLine

    const result = await importProjects({
      lines: [goodLine, badLine]
    })

    expect(result.is_err())
    expect(result.unwrap_err().message.indexOf(ERREUR_FORMAT_LIGNE)).toEqual(0)
  })

  it('inserts all given projects to the store', async () => {
    const priorProjects = await projectRepo.findAll()

    expect(priorProjects).toHaveLength(0)

    const phonyLine = makePhonyLine()
    await importProjects({
      lines: [phonyLine]
    })

    const newProjects = await projectRepo.findAll()

    // What is expected is the same as the phonyLine
    // but with numbers instead of strings
    // and project entity property names
    const expectedLine = {
      appelOffreId: 'fessenheim',
      periodeId: '6',
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
      classe: 'Classé',
      motifsElimination: 'motifsElimination'
    }

    expect(newProjects).toHaveLength(1)
    expect(newProjects).toContainEqual(expect.objectContaining(expectedLine))
  })
})
