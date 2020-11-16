import moment from 'moment'
import os from 'os'
import path from 'path'
import sanitize from 'sanitize-filename'
import { makeProjectIdentifier } from '../entities/project'
import { fillDocxTemplate } from '../helpers/fillDocxTemplate'
import { formatDate } from '../helpers/formatDate'
import { NotFoundError, SuccessFile, SystemError } from '../helpers/responses'
import { HttpRequest } from '../types'
import { getUserProject } from '../useCases'
import { userRepo } from '../dataAccess'

const getModeleMiseEnDemeure = async (request: HttpRequest) => {
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

    const filepath = path.join(
      os.tmpdir(),
      sanitize(`Mise en demeure Garanties Financières - ${project.nomProjet}.docx`)
    )

    // Get the user's dreal region(s)
    const userDreals = await userRepo.findDrealsForUser(request.user.id)

    // If there are multiple, use the first to coincide with the project
    const dreal = userDreals.find((dreal) => project.regionProjet.includes(dreal))

    if (!dreal) {
      return NotFoundError('Impossible de générer le fichier demandé.')
    }

    const templatePath = path.resolve(
      __dirname,
      '../',
      'views',
      'template',
      'Modèle mise en demeure v2.docx'
    )

    const imageToInject = path.resolve(__dirname, '../public/images/dreals', `${dreal}.png`)

    await fillDocxTemplate({
      templatePath,
      outputPath: filepath,
      injectImage: imageToInject,
      variables: {
        dreal,
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
    console.error(error)
    return SystemError('Impossible de générer le fichier modèle de mise en demeure')
  }
}

export { getModeleMiseEnDemeure }
