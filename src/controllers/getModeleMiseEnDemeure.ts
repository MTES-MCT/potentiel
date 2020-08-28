import {
  Redirect,
  Success,
  SuccessFile,
  SystemError,
  NotFoundError,
} from '../helpers/responses'
import { fillDocxTemplate } from '../helpers/fillDocxTemplate'
import sanitize from 'sanitize-filename'
import moment from 'moment'
import { makeProjectFilePath } from '../helpers/makeProjectFilePath'
import { Controller, HttpRequest } from '../types'
import ROUTES from '../routes'
import { getUserProject } from '../useCases'
import { makeProjectIdentifier } from '../entities/project'

import { makeCertificate } from '../views/pages/candidateCertificate'

import fs from 'fs'
import util from 'util'
import path from 'path'
const dirExists = util.promisify(fs.exists)
const makeDir = util.promisify(fs.mkdir)
const makeDirIfNecessary = async (dirpath) => {
  const exists = await dirExists(dirpath)
  if (!exists) await makeDir(dirpath)

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
      sanitize(
        `Mise en demeure Garanties Financières - ${project.nomProjet}.docx`
      )
    )

    await makeDirIfNecessary(path.dirname(filepath))

    const templatePath = path.resolve(
      __dirname,
      '../',
      'views',
      'template',
      'Modèle mise en demeure.docx'
    )

    const dateFormat = 'DD/MM/YYYY'

    await fillDocxTemplate({
      templatePath,
      outputPath: filepath,
      variables: {
        dreal: project.regionProjet.toUpperCase(),
        dateMiseEnDemeure: moment().format(dateFormat),
        contactDreal: request.user.email,
        referenceProjet: makeProjectIdentifier(project),
        titreAppelOffre: project.appelOffre?.title || '!!!AO NON DISPONIBLE!!!',
        dateLancementAppelOffre:
          project.appelOffre?.launchDate || '!!!AO NON DISPONIBLE!!!',
        nomProjet: project.nomProjet,
        adresseCompleteProjet: `${project.adresseProjet} ${project.codePostalProjet} ${project.communeProjet}`,
        puissanceProjet: project.puissance.toString(),
        unitePuissance:
          project.appelOffre?.unitePuissance || '!!!AO NON DISPONIBLE!!!',
        titrePeriode:
          project.appelOffre?.periode?.title || '!!!AO NON DISPONIBLE!!!',
        dateNotification: moment(project.notifiedOn).format(dateFormat),
        paragrapheGF:
          project.appelOffre?.renvoiRetraitDesignationGarantieFinancieres ||
          '!!!AO NON DISPONIBLE!!!',
        garantieFinanciereEnMois:
          project.famille?.garantieFinanciereEnMois.toString() ||
          '!!!FAMILLE NON DISPONIBLE!!!',
        dateFinGarantieFinanciere: project.famille
          ? moment(project.notifiedOn)
              .add(project.famille.garantieFinanciereEnMois, 'months')
              .format(dateFormat)
          : '!!!FAMILLE NON DISPONIBLE!!!',
        dateLimiteDepotGF: moment(project.garantiesFinancieresDueOn).format(
          dateFormat
        ),
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
    return SystemError(
      'Impossible de générer le fichier modèle de mise en demeure'
    )
  }
}

export { getModeleMiseEnDemeure }
