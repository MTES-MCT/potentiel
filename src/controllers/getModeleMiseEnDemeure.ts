import { SuccessFile, SystemError, NotFoundError } from '../helpers/responses'
import { fillDocxTemplate } from '../helpers/fillDocxTemplate'
import sanitize from 'sanitize-filename'
import moment from 'moment'
import { makeProjectFilePath } from '../helpers/makeProjectFilePath'
import { formatDate } from '../helpers/formatDate'
import { HttpRequest } from '../types'
import { getUserProject } from '../useCases'
import { makeProjectIdentifier } from '../entities/project'

import fs from 'fs'
import util from 'util'
import path from 'path'
import { pathExists } from '../core/utils'

const makeDir = util.promisify(fs.mkdir)

const makeDirIfNecessary = async (dirpath) => {
  const dirExists: boolean = await pathExists(dirpath)
  if (!dirExists) await makeDir(dirpath)
  return dirpath
}

const getModeleMiseEnDemeure = async (request: HttpRequest) => {
  console.log('Call to getModeleMiseEnDemeure received', request.query)

  try {
    const { projectId } = request.params

    if (!request.user || request.user.role !== 'dreal') {
      // Should never happen, login is verified at the server level
      return SystemError('Impossible de générer le fichier sans être connecté')
    }

    // Verify that the current user has the rights to check this out
    const project = await getUserProject({ user: request.user, projectId })

    if (!project) {
      return NotFoundError('Impossible de générer le fichier demandé.')
    }

    const { filepath } = makeProjectFilePath(
      project.id,
      sanitize(`Mise en demeure Garanties Financières - ${project.nomProjet}.docx`)
    )

    await makeDirIfNecessary(path.dirname(filepath))

    const templatePath = path.resolve(
      __dirname,
      '../',
      'views',
      'template',
      'Modèle mise en demeure.docx'
    )

    await fillDocxTemplate({
      templatePath,
      outputPath: filepath,
      variables: {
        dreal: project.regionProjet.toUpperCase(),
        dateMiseEnDemeure: formatDate(Date.now()),
        contactDreal: request.user.email,
        referenceProjet: makeProjectIdentifier(project),
        titreAppelOffre: project.appelOffre?.title || '!!!AO NON DISPONIBLE!!!',
        dateLancementAppelOffre: project.appelOffre?.launchDate || '!!!AO NON DISPONIBLE!!!',
        nomProjet: project.nomProjet,
        adresseCompleteProjet: `${project.adresseProjet} ${project.codePostalProjet} ${project.communeProjet}`,
        puissanceProjet: project.puissance.toString(),
        unitePuissance: project.appelOffre?.unitePuissance || '!!!AO NON DISPONIBLE!!!',
        titrePeriode: project.appelOffre?.periode?.title || '!!!AO NON DISPONIBLE!!!',
        dateNotification: formatDate(project.notifiedOn),
        paragrapheGF:
          project.appelOffre?.renvoiRetraitDesignationGarantieFinancieres ||
          '!!!AO NON DISPONIBLE!!!',
        garantieFinanciereEnMois:
          project.famille?.garantieFinanciereEnMois?.toString() || '!!!FAMILLE NON DISPONIBLE!!!',
        dateFinGarantieFinanciere: project.famille
          ? formatDate(
              moment(project.notifiedOn)
                .add(project.famille.garantieFinanciereEnMois, 'months')
                .toDate()
                .getTime()
            )
          : '!!!FAMILLE NON DISPONIBLE!!!',
        dateLimiteDepotGF: formatDate(project.garantiesFinancieresDueOn),
        nomRepresentantLegal: project.nomRepresentantLegal,
        adresseProjet: project.adresseProjet,
        codePostalProjet: project.codePostalProjet,
        communeProjet: project.communeProjet,
        emailProjet: project.email,
      },
    })

    return SuccessFile(filepath)
  } catch (error) {
    console.log('getModeleMiseEnDemeure error', error)
    return SystemError('Impossible de générer le fichier modèle de mise en demeure')
  }
}

export { getModeleMiseEnDemeure }
