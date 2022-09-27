import asyncHandler from '../helpers/asyncHandler'
import moment from 'moment'
import os from 'os'
import path from 'path'
import sanitize from 'sanitize-filename'
import { userRepo } from '@dataAccess'
import { fillDocxTemplate } from '../../helpers/fillDocxTemplate'
import { formatDate } from '../../helpers/formatDate'
import routes from '@routes'
import { getUserProject } from '@useCases'
import { ensureRole } from '@config'
import { v1Router } from '../v1Router'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { notFoundResponse, unauthorizedResponse } from '../helpers'

v1Router.get(
  routes.TELECHARGER_MODELE_MISE_EN_DEMEURE(),
  ensureRole('dreal'),
  asyncHandler(async (request, response) => {
    const { projectId } = request.params

    if (!validateUniqueId(projectId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
    }

    // Verify that the current user has the rights to check this out
    const project = await getUserProject({ user: request.user, projectId })

    if (!project) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
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
      return unauthorizedResponse({ request, response })
    }

    const templatePath = path.resolve(
      __dirname,
      '../..',
      'views',
      'template',
      'Modèle mise en demeure v2.docx'
    )

    const imageToInject = path.resolve(__dirname, '../../public/images/dreals', `${dreal}.png`)

    await fillDocxTemplate({
      templatePath,
      outputPath: filepath,
      injectImage: imageToInject,
      variables: {
        dreal,
        dateMiseEnDemeure: formatDate(Date.now()),
        contactDreal: request.user.email,
        referenceProjet: project.potentielIdentifier,
        titreAppelOffre: project.appelOffre?.periode
          ? `${project.appelOffre?.periode.cahierDesCharges.référence} ${project.appelOffre.title}`
          : '!!!AO NON DISPONIBLE!!!',
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
          project.famille?.soumisAuxGarantiesFinancieres === 'après candidature'
            ? project.famille.garantieFinanciereEnMois?.toString()
            : project.appelOffre?.soumisAuxGarantiesFinancieres === 'après candidature'
            ? project.appelOffre.garantieFinanciereEnMois.toString()
            : '!!!GARANTIE FINANCIERE EN MOIS NON DISPONIBLE!!!',
        dateFinGarantieFinanciere:
          project.famille?.soumisAuxGarantiesFinancieres === 'après candidature'
            ? formatDate(
                moment(project.notifiedOn)
                  .add(project.famille.garantieFinanciereEnMois, 'months')
                  .toDate()
                  .getTime()
              )
            : project.appelOffre?.soumisAuxGarantiesFinancieres === 'après candidature'
            ? formatDate(
                moment(project.notifiedOn)
                  .add(project.appelOffre.garantieFinanciereEnMois, 'months')
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

    return response.sendFile(path.resolve(process.cwd(), filepath))
  })
)
