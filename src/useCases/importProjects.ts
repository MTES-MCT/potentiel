import {
  Project,
  makeProject,
  AppelOffre,
  Periode,
  applyProjectUpdate,
  User,
} from '../entities'
import { ProjectRepo, AppelOffreRepo } from '../dataAccess'
import _ from 'lodash'
import { Result, ResultAsync, Err, Ok, ErrorResult } from '../types'
import toNumber from '../helpers/toNumber'
import getDepartementRegionFromCodePostal from '../helpers/getDepartementRegionFromCodePostal'
import moment from 'moment'
import { retrievePassword } from '.'

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
  appelOffreRepo: AppelOffreRepo
}

interface CallUseCaseProps {
  userId: User['id']
  lines: Array<Record<string, any>> // the csv lines (split by separator)
}

export const ERREUR_AUCUNE_LIGNE = 'Le fichier semble vide (aucune ligne)'
export const ERREUR_FORMAT_LIGNE = 'Le fichier comporte des lignes erronées'
export const ERREUR_INSERTION = "Impossible d'insérer les projets en base"

const makeErrorForLine = (
  error: Error,
  lineIndex: number,
  currentResults: Result<Array<Project>, Array<Error>>
) => {
  let errors: Array<Error> = []
  if (currentResults.is_err()) {
    // It already had errors, add this one
    errors = currentResults.unwrap_err()
  }
  // Add the error from this line prefixed with the line number
  error.message =
    'Ligne ' +
    lineIndex +
    ': ' +
    error.message.replace(
      'Failed constraint check in field',
      'Valeur interdite dans le champ'
    )
  errors.push(error)

  return Err<Array<Project>, Array<Error>>(errors)
}

const appendInfo = (obj, key, value) => {
  if (!obj[key]) {
    obj[key] = value
  } else {
    if (!obj[key].includes(value)) {
      obj[key] += ' / ' + value
    }
  }
}

const getCodePostalProperties = (properties, value) => {
  if (!value) return properties

  const codePostalValues = value.split('/').map((item) => item.trim())

  const { codePostal, region, departement } = codePostalValues
    .map((codePostalValue) => {
      return getDepartementRegionFromCodePostal(codePostalValue)
    })
    .filter((item) => !!item)
    .reduce(
      (geoInfo, departementRegion) => {
        const { codePostal, region, departement } = departementRegion

        appendInfo(geoInfo, 'codePostal', codePostal)
        appendInfo(geoInfo, 'departement', departement)
        appendInfo(geoInfo, 'region', region)

        return geoInfo
      },
      {
        codePostal: '',
        departement: '',
        region: '',
      }
    )

  return {
    ...properties,
    codePostalProjet: codePostal,
    departementProjet: departement,
    regionProjet: region,
  }
}

interface ImportReturnType {
  appelOffreId: AppelOffre['id'] | undefined
  periodeId: Periode['id'] | undefined
  savedProjects: number
  unnotifiedProjects: number
}

export default function makeImportProjects({
  projectRepo,
  appelOffreRepo,
}: MakeUseCaseProps) {
  return async function importProjects({
    lines,
    userId,
  }: CallUseCaseProps): ResultAsync<ImportReturnType> {
    // console.log('importProjects use-case with ' + lines.length + ' lines')

    // Check if there is at least one line to insert
    if (!lines || !lines.length) {
      console.log('importProjects use-case: missing lines', lines)
      return ErrorResult(ERREUR_AUCUNE_LIGNE)
    }

    const appelsOffre = await appelOffreRepo.findAll()

    // Check individual lines (use makeProject on each)
    const projects = lines.reduce<Result<Array<Project>, Array<Error>>>(
      (currentResults, line, index) => {
        // console.log('line', line)
        // Find the corresponding appelOffre
        const appelOffreId = line["Appel d'offres"]
        const appelOffre = appelsOffre.find(
          (appelOffre) => appelOffre.id === appelOffreId
        )

        if (!appelOffreId || !appelOffre) {
          console.log('Appel offre introuvable', appelOffreId)
          return makeErrorForLine(
            new Error("Appel d'offre introuvable " + appelOffreId),
            index + 2,
            currentResults
          )
        }

        // Check the periode
        const periodeId = line['Période']
        const periode = appelOffre.periodes.find(
          (periode) => periode.id === periodeId
        )

        if (!periodeId || !periode) {
          console.log(
            'Periode introuvable',
            periodeId,
            appelOffre.periodes.map((item) => item.id)
          )
          return makeErrorForLine(
            new Error('Période introuvable'),
            index + 2,
            currentResults
          )
        }

        // All good, try to make the project
        const projectData = {
          appelOffreId,
          periodeId,
          ...appelOffre.dataFields.reduce((properties, dataField) => {
            const { field, column, type, value, defaultValue } = dataField

            if (type === 'codePostal') {
              return getCodePostalProperties(properties, line[column])
            }

            // Parse line depending on column format
            const fieldValue =
              type === 'string'
                ? line[column] && line[column].trim()
                : type === 'number'
                ? toNumber(line[column], defaultValue)
                : type === 'date'
                ? (line[column] &&
                    moment(line[column], 'DD/MM/YYYY').toDate().getTime()) ||
                  undefined
                : type === 'stringEquals'
                ? line[column] === value
                : type === 'orNumberInColumn'
                ? line[column]
                  ? toNumber(line[column], defaultValue)
                  : (value && toNumber(line[value], defaultValue)) ||
                    defaultValue
                : type === 'orStringInColumn'
                ? line[column] || (value && line[value])
                : undefined

            return {
              ...properties,
              [field]: fieldValue,
            }
          }, {}),
        }

        const projectResult = makeProject(projectData as Project)

        if (projectResult.is_err()) {
          // This line is an error
          // console.log(
          //   'importProjects use-case: this line has an error',
          //   projectData,
          //   // line,
          //   projectResult.unwrap_err()
          // )

          // Add the error from this line prefixed with the line number
          const projectError = projectResult.unwrap_err()
          // projectError.message =
          //   'Ligne ' + (index + 2) + ': ' + projectError.message

          return makeErrorForLine(projectError, index + 2, currentResults)
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
      },
      Ok([]) as Result<Array<Project>, Array<Error>>
    )

    if (projects.is_err()) {
      // console.log(
      //   'importProjects use-case: some projects have errors',
      //   projects.unwrap_err()
      // )
      const error = new Error()
      error.message = projects
        .unwrap_err()
        .reduce(
          (message, error) => message + ':\n' + error.message,
          ERREUR_FORMAT_LIGNE
        )
      return Err(error)
    }

    const insertions: Array<Result<Project, Error>> = (
      await Promise.all(
        projects.unwrap().map(async (newProject) => {
          const { appelOffreId, periodeId, numeroCRE, familleId } = newProject
          // console.log('importProjects use-case, project ', newProject.nomProjet)

          // An existing project would have the same appelOffre, perdiode, numeroCRE and famille
          const existingProject = await projectRepo.findOne({
            appelOffreId,
            periodeId,
            numeroCRE,
            // only if project has a famille
            ...(familleId ? { familleId } : {}),
          })

          if (existingProject) {
            // console.log('importProjects use-case found existing project')
            const updatedProject = applyProjectUpdate({
              project: existingProject,
              update: newProject,
              context: {
                type: 'import',
                userId,
              },
            })

            if (!updatedProject) {
              // console.log('importProjects use-case no update, ignore')
              // Project has not been changed, nothing to do
              return Ok(null)
            }

            return projectRepo.save(updatedProject)
          }

          // No existing project => newly imported project
          // applyProjectUpdate will add an event to the new project history
          const newlyImportedProject = applyProjectUpdate({
            project: newProject,
            context: {
              type: 'import',
              userId,
            },
          })

          if (!newlyImportedProject) {
            console.log(
              'importProject use-case failed when calling applyProjectUpdate on a newly imported project'
            )
            return ErrorResult(ERREUR_INSERTION)
          }

          return projectRepo.save(newlyImportedProject)
        })
      )
    ).filter(
      // Only keep errors or Projects (ignore null cases which are noops)
      (
        project: Result<Project | null, Error>
      ): project is Result<Project, Error> =>
        project.is_err() || project.unwrap() !== null
    )

    if (insertions.some((project) => project.is_err())) {
      console.log(
        'importProjects use-case: some insertions have errors',
        insertions
          .filter((item) => item.is_err())
          .map((item) => item.unwrap_err())
      )
      projects.unwrap_err()
      // Some projects failed to be inserted
      // Remove all the others
      await Promise.all(
        insertions
          .filter((project) => project.is_ok())
          .map((project) => project.unwrap().id)
          .map(projectRepo.remove)
      )
      return ErrorResult(ERREUR_INSERTION)
    }

    const insertedProjects: Array<Project> = insertions
      .filter((project) => project.is_ok())
      .map((project) => project.unwrap())

    const unnotifiedProjects: number = insertedProjects.filter(
      (project) => project.notifiedOn === 0
    ).length

    // This will help the controller redirect to the project list with the proper filters
    const exampleInsertedProject: Project | undefined =
      insertedProjects && insertedProjects.length
        ? insertedProjects[0]
        : undefined

    const { appelOffreId, periodeId } = exampleInsertedProject || {
      appelOffreId: undefined,
      periodeId: undefined,
    }

    return Ok({
      appelOffreId,
      periodeId,
      savedProjects: insertedProjects.length,
      unnotifiedProjects,
    })
  }
}
