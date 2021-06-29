import { Project, makeProject, AppelOffre, Periode, applyProjectUpdate, User } from '../entities'
import { ProjectRepo, AppelOffreRepo, UserRepo } from '../dataAccess'
import { Result, ResultAsync, Err, Ok, ErrorResult } from '../types'
import toNumber from '../helpers/toNumber'
import getDepartementRegionFromCodePostal from '../helpers/getDepartementRegionFromCodePostal'
import moment from 'moment-timezone'
import { EventBus } from '../modules/eventStore'
import { ProjectImported, ProjectReimported } from '../modules/project/events'
import { logger } from '../core/utils'
import _ from 'lodash'
import {
  LegacyModificationImported,
  LegacyModificationImportedPayload,
} from '../modules/modificationRequest'

moment.tz.setDefault('Europe/Paris')

interface MakeUseCaseProps {
  eventBus: EventBus
  findOneProject: ProjectRepo['findOne']
  saveProject: ProjectRepo['save']
  removeProject: ProjectRepo['remove']
  addProjectToUserWithEmail: UserRepo['addProjectToUserWithEmail']
  appelOffreRepo: AppelOffreRepo
}

interface CallUseCaseProps {
  userId: User['id']
  lines: Array<Record<string, any>> // the csv lines (split by separator)
}

export const ERREUR_AUCUNE_LIGNE = 'Le fichier semble vide (aucune ligne)'
export const ERREUR_FORMAT_LIGNE = 'Le fichier comporte des lignes erronées'
export const ERREUR_INSERTION = "Impossible d'insérer les projets en base"

const makeErrorForLine = <T>(
  error: Error,
  lineIndex: number,
  currentResults: Result<T, Array<Error>>
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
    error.message.replace('Failed constraint check in field', 'Valeur interdite dans le champ')
  errors.push(error)

  return Err<T, Array<Error>>(errors)
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

function extractModificationType(
  line,
  index,
  sameDateModification
): LegacyModificationImportedPayload {
  const modifiedOn = moment(line[`Date de modification ${index}`], 'DD/MM/YYYY').toDate().getTime()
  const projectId = ''
  switch (line[`Type de modification ${index}`]) {
    case 'Abandon':
      return { type: 'abandon', modifiedOn, projectId }
    case 'Recours gracieux':
      if (!['Classé ?', "Motif d'élimination"].includes(line[`Colonne concernée ${index}`])) {
        throw new Error(
          `Colonne concernée ${index} doit être soit Classé ? soit Motif d'élimination pour un Recours gracieux`
        )
      }

      if (line[`Colonne concernée ${index}`] === 'Classé ?') {
        if (!['Classé', 'Eliminé'].includes(line[`Ancienne valeur ${index}`])) {
          throw new Error(
            `Ancienne valeur ${index} doit être soit Classé soit Eliminé pour un Recours gracieux`
          )
        }

        const accepted = line[`Ancienne valeur ${index}`] === 'Classé'
        return {
          type: 'recours',
          projectId,
          modifiedOn,
          accepted,
          motifElimination: '',
        }
      } else {
        return { ...sameDateModification, motifElimination: line[`Ancienne valeur ${index}`] }
      }

    case 'Prolongation de délai':
      const nouvelleDateLimiteAchevement = moment(line[`Colonne concernée ${index}`], 'DD/MM/YYYY')
        .toDate()
        .getTime()
      if (isNaN(nouvelleDateLimiteAchevement)) {
        throw new Error(`Colonne concernée ${index} contient une date invalide`)
      }
      const ancienneDateLimiteAchevement = moment(line[`Ancienne valeur ${index}`], 'DD/MM/YYYY')
        .toDate()
        .getTime()

      if (isNaN(ancienneDateLimiteAchevement)) {
        throw new Error(`Ancienne valeur ${index} contient une date invalide`)
      }
      return {
        type: 'delai',
        projectId,
        modifiedOn,
        nouvelleDateLimiteAchevement,
        ancienneDateLimiteAchevement,
      }
    case "Changement d'actionnaire":
      if (line[`Colonne concernée ${index}`] === 'Candidat') {
        return {
          type: 'actionnaire',
          actionnairePrecedent: line[`Ancienne valeur ${index}`],
          siretPrecedent: '',
          projectId,
          modifiedOn,
        }
      } else if (line[`Colonne concernée ${index}`] === 'Numéro SIREN ou SIRET*') {
        return {
          ...sameDateModification,
          siretPrecedent: line[`Ancienne valeur ${index}`],
          projectId,
          modifiedOn,
        }
      } else {
        throw new Error(`Colonne concernée ${index} n'est pas reconnue`)
      }
    case 'Changement de producteur':
      if (
        line[`Colonne concernée ${index}`] ===
        'Nom (personne physique) ou raison sociale (personne morale) : '
      ) {
        return {
          type: 'producteur',
          producteurPrecedent: line[`Ancienne valeur ${index}`],
          projectId,
          modifiedOn,
        }
      } else {
        throw new Error(`Colonne concernée ${index} n'est pas reconnue`)
      }
    default:
      throw new Error(`Type de modification ${index} n'est pas reconnu`)
  }
}

function extractLegacyModifications(
  properties: Record<typeof LegacyModificationColumns[number], string>
) {
  const modificationsByDate: Record<string, LegacyModificationImportedPayload> = {}
  for (const index of [1, 2, 3]) {
    if (properties[`Type de modification ${index}`]) {
      const date = properties[`Date de modification ${index}`]
      modificationsByDate[date] = extractModificationType(
        properties,
        index,
        modificationsByDate[date]
      )
    }
  }

  return Object.values(modificationsByDate)
}

const LegacyModificationColumns = [
  'Type de modification 1',
  'Date de modification 1',
  'Colonne concernée 1',
  'Ancienne valeur 1',
  'Type de modification 2',
  'Date de modification 2',
  'Colonne concernée 2',
  'Ancienne valeur 2',
  'Type de modification 3',
  'Date de modification 3',
  'Colonne concernée 3',
  'Ancienne valeur 3',
] as const

interface ImportReturnType {
  appelOffreId: AppelOffre['id'] | undefined
  periodeId: Periode['id'] | undefined
  savedProjects: number
  unnotifiedProjects: number
}

export default function makeImportProjects({
  eventBus,
  findOneProject,
  saveProject,
  removeProject,
  addProjectToUserWithEmail,
  appelOffreRepo,
}: MakeUseCaseProps) {
  return async function importProjects({
    lines,
    userId,
  }: CallUseCaseProps): ResultAsync<ImportReturnType> {
    // Check if there is at least one line to insert
    if (!lines || !lines.length) {
      logger.error('importProjects use-case: missing lines.')
      return ErrorResult(ERREUR_AUCUNE_LIGNE)
    }

    const appelsOffre = await appelOffreRepo.findAll()

    // Check individual lines (use makeProject on each)
    const projects = lines.reduce<
      Result<
        Array<
          Partial<Project> & {
            legacyModifications: LegacyModificationImportedPayload[]
          }
        >,
        Array<Error>
      >
    >((currentResults, line, index) => {
      // The actual line number is removed by 2 because of the csv file header lines
      const lineIndex = index + 2

      // Find the corresponding appelOffre
      const appelOffreId = line["Appel d'offres"]
      const appelOffre = appelsOffre.find((appelOffre) => appelOffre.id === appelOffreId)

      if (!appelOffreId || !appelOffre) {
        logger.error(`Appel offre introuvable. Id : ${appelOffreId}`)
        return makeErrorForLine(
          new Error("Appel d'offre introuvable " + appelOffreId),
          lineIndex,
          currentResults
        )
      }

      // Check the periode
      const periodeId = line['Période']
      const periode = appelOffre.periodes.find((periode) => periode.id === periodeId)

      if (!periodeId || !periode) {
        logger.error(`Periode introuvable. Id: ${periodeId}`)
        logger.info(
          'Periode introuvable',
          appelOffre.periodes.map((item) => item.id)
        )
        return makeErrorForLine(new Error('Période introuvable'), lineIndex, currentResults)
      }

      // Check the famille
      const familleId = line.Famille
      if (familleId) {
        const famille = appelOffre.familles.find((famille) => famille.id === familleId)
        if (!famille) {
          console.log('famille erronnée', familleId)
          return makeErrorForLine(
            new Error('Famille inconnue pour cet appel d‘offre'),
            lineIndex,
            currentResults
          )
        }
      }
      if (appelOffre.familles.length && !familleId) {
        console.log('famille manquante', appelOffre)
        return makeErrorForLine(
          new Error('Famille manquante (cet appel d‘offre requiert une famille)'),
          lineIndex,
          currentResults
        )
      }

      let legacyModifications: LegacyModificationImportedPayload[] = []
      try {
        legacyModifications = extractLegacyModifications(_.pick(line, LegacyModificationColumns))
      } catch (e) {
        return makeErrorForLine(e, lineIndex, currentResults)
      }

      // Keep track of all the columns that where picked from the line
      // We will use this to gather all the "other" columns in the project.details section
      const pickedColumns: Array<string> = ["Appel d'offres", 'Période', 'Famille']

      // All good, try to make the project
      const projectData: Partial<Project> = {
        appelOffreId,
        periodeId,
        familleId: familleId || '',
        ...appelOffre.dataFields.reduce((properties, dataField) => {
          const { field, column, type, value, defaultValue } = dataField

          pickedColumns.push(column)

          if (type === 'codePostal') {
            return getCodePostalProperties(properties, line[column])
          }

          // Parse line depending on column format
          const fieldValue =
            field === 'email'
              ? line[column] && line[column].split('/')[0].trim().toLowerCase()
              : type === 'string'
              ? line[column] && line[column].trim()
              : type === 'number'
              ? toNumber(line[column], defaultValue)
              : type === 'date'
              ? (line[column] && moment(line[column], 'DD/MM/YYYY').toDate().getTime()) || undefined
              : type === 'stringEquals'
              ? line[column] === value
              : type === 'orNumberInColumn'
              ? line[column]
                ? toNumber(line[column], defaultValue)
                : (value && toNumber(line[value], defaultValue)) || defaultValue
              : type === 'orStringInColumn'
              ? line[column] || (value && line[value])
              : undefined

          return {
            ...properties,
            [field]: fieldValue,
          }
        }, {}),
      }

      projectData.puissanceInitiale = projectData.puissance

      // Add all the other columns of the csv into the details section of the project
      projectData.details = Object.entries(line)
        .filter(
          ([columnTitle]) =>
            !((LegacyModificationColumns as unknown) as string[]).includes(columnTitle) &&
            !pickedColumns.includes(columnTitle)
        )
        .reduce(
          (map, [columnTitle, value]) => ({
            ...map,
            [columnTitle]: value,
          }),
          {}
        )

      // Validate the project data using makeProject
      const projectResult = makeProject(projectData as Project)
      if (projectResult.is_err()) {
        // Add the error from this line prefixed with the line number
        const projectError = projectResult.unwrap_err()

        return makeErrorForLine(projectError, index + 2, currentResults)
      }

      if (currentResults.is_err()) {
        // This line is not an error but previous lines are
        return currentResults
      }

      // No errors so far
      // Add this line's project to the current list
      const projects = currentResults.unwrap()
      projects.push({
        ...projectData,
        legacyModifications,
      })
      return Ok(projects)
    }, Ok([]))

    if (projects.is_err()) {
      const error = new Error()
      error.message = projects
        .unwrap_err()
        .reduce((message, error) => message + ':\n' + error.message, ERREUR_FORMAT_LIGNE)
      return Err(error)
    }

    const insertions: Array<Result<Project, Error>> = (
      await Promise.all(
        projects.unwrap().map(async ({ legacyModifications, ...newProject }) => {
          const { appelOffreId, periodeId, numeroCRE, familleId } = newProject

          // An existing project would have the same appelOffre, perdiode, numeroCRE and famille
          const existingProject = await findOneProject({
            appelOffreId,
            periodeId,
            numeroCRE,
            // only if project has a famille
            ...(familleId ? { familleId } : {}),
          })

          async function triggerLegacyModifications(projectId: string) {
            await Promise.all(
              legacyModifications.map((modification) => {
                return eventBus.publish(
                  new LegacyModificationImported({
                    // @ts-ignore
                    payload: {
                      ...modification,
                      projectId,
                    },
                  })
                )
              })
            )
          }

          if (existingProject) {
            const updatedProject = applyProjectUpdate({
              project: existingProject,
              update: newProject,
              context: {
                type: 'import',
                userId,
              },
            })

            if (!updatedProject) {
              // Project has not been changed, nothing to do
              return Ok(null)
            }

            await eventBus.publish(
              new ProjectReimported({
                payload: {
                  projectId: updatedProject.id,
                  notifiedOn: existingProject.notifiedOn,
                  data: updatedProject as ProjectReimported['payload']['data'],
                  importedBy: userId,
                },
              })
            )

            await triggerLegacyModifications(updatedProject.id)

            return (await saveProject(updatedProject)).map(() => updatedProject)
          }

          // No existing project => newly imported project
          // applyProjectUpdate will add an event to the new project history

          // use makeProject to add an id and include defaults
          const newProjectRes = makeProject(newProject as Project)

          if (newProjectRes.is_err()) {
            logger.error(
              'importProject use-case failed when calling makeProject on a newly imported project'
            )
            return ErrorResult<Project>(ERREUR_INSERTION)
          }

          const newlyImportedProject = applyProjectUpdate({
            project: newProjectRes.unwrap(),
            context: {
              type: 'import',
              userId,
            },
          })

          if (!newlyImportedProject) {
            logger.error(
              'importProject use-case failed when calling applyProjectUpdate on a newly imported project'
            )
            return ErrorResult<Project>(ERREUR_INSERTION)
          }

          await eventBus.publish(
            new ProjectImported({
              payload: {
                projectId: newlyImportedProject.id,
                appelOffreId: newlyImportedProject.appelOffreId,
                periodeId: newlyImportedProject.periodeId,
                numeroCRE: newlyImportedProject.numeroCRE,
                familleId: newlyImportedProject.familleId,
                data: newlyImportedProject as ProjectImported['payload']['data'],
                importedBy: userId,
              },
            })
          )

          await triggerLegacyModifications(newlyImportedProject.id)

          return (await saveProject(newlyImportedProject)).map(() => newlyImportedProject)
        })
      )
    ).filter(
      // Only keep errors or Projects (ignore null cases which are noops)
      (project: Result<Project | null, Error>): project is Result<Project, Error> =>
        project.is_err() || project.unwrap() !== null
    )

    if (insertions.some((project) => project.is_err())) {
      logger.error('importProjects use-case: some insertions have errors')
      logger.info(
        'importProjects use-case: some insertions have errors',
        insertions.filter((item) => item.is_err()).map((item) => item.unwrap_err())
      )
      projects.unwrap_err()
      // Some projects failed to be inserted
      // Remove all the others
      await Promise.all(
        insertions
          .filter((project) => project.is_ok())
          .map((project) => project.unwrap().id)
          .map(removeProject)
      )
      return ErrorResult(ERREUR_INSERTION)
    }

    const insertedProjects: Array<Project> = insertions
      .filter((project) => project.is_ok())
      .map((project) => project.unwrap())

    // For each project, add it to the user with the same email
    await Promise.all(
      insertedProjects.map((project) => addProjectToUserWithEmail(project.id, project.email))
    )

    const unnotifiedProjects: number = insertedProjects.filter(
      (project) => project.notifiedOn === 0
    ).length

    // This will help the controller redirect to the project list with the proper filters
    const exampleInsertedProject: Project | undefined =
      insertedProjects && insertedProjects.length ? insertedProjects[0] : undefined

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
