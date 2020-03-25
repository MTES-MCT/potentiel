import { Project, makeProject } from '../entities'
import { ProjectRepo } from '../dataAccess'
import _ from 'lodash'
import { Result, ResultAsync, Err, Ok, ErrorResult } from '../types'
import toNumber from '../helpers/toNumber'

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
}

interface CallUseCaseProps {
  periode: string
  headers: Array<string> // The csv header (to check columns)
  lines: Array<Record<string, any>> // the csv lines (split by separator)
}

export const MANDATORY_HEADER_COLUMNS: Array<string> = [
  'numeroCRE',
  'famille',
  'nomCandidat',
  'nomProjet',
  'puissance(kWc)',
  'prixReference(euros/MWh)',
  'evaluationCarbone(kg eq CO2/kWc)',
  'note',
  'nomRepresentantLegal',
  'email',
  'adresseProjet',
  'codePostalProjet',
  'communeProjet',
  'departementProjet',
  'regionProjet',
  'classé(1/0)',
  'motifsElimination',
  'fournisseur',
  'actionnaire'
]

export const ERREUR_PERIODE = 'Periode manquante'
export const ERREUR_COLONNES =
  'Format du fichier erroné (vérifier conformité des colonnes)'
export const ERREUR_AUCUNE_LIGNE = 'Le fichier semble vide (aucune ligne)'
export const ERREUR_FORMAT_LIGNE = 'Le fichier comporte des lignes erronées'
export const ERREUR_INSERTION = "Impossible d'insérer les projets en base"

export default function makeImportProjects({ projectRepo }: MakeUseCaseProps) {
  return async function importProjects({
    periode,
    headers,
    lines
  }: CallUseCaseProps): ResultAsync<null> {
    // Check periode string
    if (!periode || !periode.length) {
      console.log('importProjects use-case: missing periode', headers)
      return ErrorResult(ERREUR_PERIODE)
    }

    // Check header (format of file)
    if (
      !headers ||
      !MANDATORY_HEADER_COLUMNS.every(column => headers.includes(column))
    ) {
      console.log('importProjects use-case: missing header columns', headers)
      return ErrorResult(ERREUR_COLONNES)
    }

    // Check if there is at least one line to insert
    if (!lines || !lines.length) {
      console.log('importProjects use-case: missing lines', lines)
      return ErrorResult(ERREUR_AUCUNE_LIGNE)
    }

    // Check individual lines (use makeProject on each)
    const projects = lines.reduce((currentResults, line, index) => {
      const projectResult = makeProject({
        periode,
        numeroCRE: line['numeroCRE'],
        famille: line['famille'],
        nomCandidat: line['nomCandidat'],
        nomProjet: line['nomProjet'],
        puissance: toNumber(line['puissance(kWc)']) || 0,
        prixReference: toNumber(line['prixReference(euros/MWh)']) || 0,
        evaluationCarbone:
          toNumber(line['evaluationCarbone(kg eq CO2/kWc)']) || 0,
        note: toNumber(line['note']) || -1,
        nomRepresentantLegal: line['nomRepresentantLegal'],
        email: line['email'],
        adresseProjet: line['adresseProjet'],
        codePostalProjet: line['codePostalProjet'],
        communeProjet: line['communeProjet'],
        departementProjet: line['departementProjet'],
        regionProjet: line['regionProjet'],
        classe: line['classé(1/0)'],
        motifsElimination: line['motifsElimination'],
        fournisseur: line['fournisseur'] || 'N/A',
        actionnaire: line['actionnaire'] || 'N/A',
        producteur: line['producteur'] || 'N/A',
        hasBeenNotified: false
      })

      if (projectResult.is_err()) {
        // This line is an error
        console.log(
          'importProjects use-case: this line has an error',
          line,
          projectResult.unwrap_err()
        )

        let errors: Array<Error> = []
        if (currentResults.is_err()) {
          // It already had errors, add this one
          errors = currentResults.unwrap_err()
        }
        // Add the error from this line prefixed with the line number
        const projectError = projectResult.unwrap_err()
        projectError.message =
          'Ligne ' + (index + 2) + ': ' + projectError.message
        errors.push(projectError)

        return Err(errors)
      }

      if (currentResults.is_err()) {
        // This line is not an error but previous lines are
        return currentResults
      }

      // No errors so far
      // Add this line's project to the current list
      const projects = currentResults.unwrap()
      projects.push(projectResult.unwrap())
      return Ok(projects)
    }, Ok([]))

    if (projects.is_err()) {
      console.log(
        'importProjects use-case: some projects have errors',
        projects.unwrap_err()
      )
      const error = new Error()
      error.message = projects
        .unwrap_err()
        .reduce(
          (message, error) => message + '\n' + error.message,
          ERREUR_FORMAT_LIGNE
        )
      return Err(error)
    }

    const insertions: Array<Result<Project, Error>> = await Promise.all(
      projects.unwrap().map(projectRepo.insert)
    )

    if (insertions.some(project => project.is_err())) {
      console.log(
        'importProjects use-case: some insertions have errors',
        insertions.filter(item => item.is_err()).map(item => item.unwrap_err())
      )
      projects.unwrap_err()
      // Some projects failed to be inserted
      // Remove all the others
      await Promise.all(
        insertions
          .filter(project => project.is_ok())
          .map(project => project.unwrap().id)
          .map(projectRepo.remove)
      )
      return ErrorResult(ERREUR_INSERTION)
    }

    return Ok(null)
  }
}
