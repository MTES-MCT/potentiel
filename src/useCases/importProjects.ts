import { Project, makeProject } from '../entities'
import { ProjectRepo } from '../dataAccess'
import _ from 'lodash'

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
  'motifsElimination'
]

export const ERREUR_PERIODE = 'Periode manquante'
export const ERREUR_COLONNES =
  'Format du fichier erroné (vérifier conformité des colonnes)'
export const ERREUR_AUCUNE_LIGNE = 'Le fichier semble vide (aucune ligne)'
export const ERREUR_FORMAT_LIGNE = 'Le fichier comporte des lignes erronées'

const toNumber = str => {
  return Number(str.replace(/,/g, '.'))
}

export default function makeImportProjects({ projectRepo }: MakeUseCaseProps) {
  return async function importProjects({
    periode,
    headers,
    lines
  }: CallUseCaseProps): Promise<void> {
    // Check periode string
    if (!periode || !periode.length) {
      throw { error: ERREUR_PERIODE }
    }

    // Check header (format of file)
    if (
      !headers ||
      !_.isEqual(_.sortBy(headers), _.sortBy(MANDATORY_HEADER_COLUMNS))
    ) {
      console.log('headers', headers)
      throw {
        error: ERREUR_COLONNES
      }
    }

    // Check if there is at least one line to insert
    if (!lines || !lines.length) {
      throw {
        error: ERREUR_AUCUNE_LIGNE
      }
    }

    // Check individual lines (use makeProject on each)
    const projects: Array<Project> = []
    const erroredLines: Array<{
      line: Record<string, any>
      error: any
    }> = []
    lines.forEach(line => {
      try {
        projects.push(
          makeProject({
            periode,
            numeroCRE: line['numeroCRE'],
            famille: line['famille'],
            nomCandidat: line['nomCandidat'],
            nomProjet: line['nomProjet'],
            puissance: toNumber(line['puissance(kWc)']),
            prixReference: toNumber(line['prixReference(euros/MWh)']),
            evaluationCarbone: toNumber(
              line['evaluationCarbone(kg eq CO2/kWc)']
            ),
            note: toNumber(line['note']),
            nomRepresentantLegal: line['nomRepresentantLegal'],
            email: line['email'],
            adresseProjet: line['adresseProjet'],
            codePostalProjet: line['codePostalProjet'],
            communeProjet: line['communeProjet'],
            departementProjet: line['departementProjet'],
            regionProjet: line['regionProjet'],
            classe: line['classé(1/0)'],
            motifsElimination: line['motifsElimination']
          })
        )
      } catch (e) {
        console.log('Erreur de validation', e)
        erroredLines.push({
          line: line,
          error: e.path
        })
      }
    })

    if (erroredLines.length) {
      let errorLong = ERREUR_FORMAT_LIGNE + ' ('
      erroredLines.forEach((line, index) => {
        errorLong += 'Ligne ' + (index + 1) + ' champ ' + line.error
        if (index < erroredLines.length - 1) errorLong += ', '
      })
      errorLong += ')'
      console.log('erreur lignes', errorLong)
      throw {
        error: ERREUR_FORMAT_LIGNE,
        errorLong,
        lines: erroredLines
      }
    }

    // Insert into project repo
    await projectRepo.insertMany(projects)
  }
}
