import { Project, makeProject } from '../entities'
import { ProjectRepo } from '../dataAccess'
import { cpus } from 'os'

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
}

interface CallUseCaseProps {
  periode: string
  headers: Array<string> // The csv header (to check columns)
  lines: Array<Record<string, any>> // the csv lines (split by separator)
}

export const MANDATORY_HEADER_COLUMNS: Array<string> = [
  'periode',
  'status',
  'nom',
  'nomCandidat',
  'localisation',
  'puissance',
  'prixUnitaire'
]

export const ERREUR_PERIODE = 'Periode manquante'
export const ERREUR_COLONNES =
  'Format du fichier erroné (vérifier conformité des colonnes)'
export const ERREUR_AUCUNE_LIGNE = 'Le fichier semble vide (aucune ligne)'
export const ERREUR_FORMAT_LIGNE = 'Le fichier comporte des lignes erronées'

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
    if (!headers || headers != MANDATORY_HEADER_COLUMNS) {
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
            status: line.status,
            nom: line.nom,
            nomCandidat: line.nomCandidat,
            localisation: line.localisation,
            puissance: line.puissance,
            prixUnitaire: line.prixUnitaire
          })
        )
      } catch (e) {
        erroredLines.push({
          line: line,
          error: e
        })
      }
    })

    if (erroredLines.length) {
      throw {
        error: ERREUR_FORMAT_LIGNE,
        lines: erroredLines
      }
    }

    // Insert into project repo
    await projectRepo.insertMany(projects)
  }
}
