import os from 'os'
import path from 'path'
import sanitize from 'sanitize-filename'
import { eventStore } from '../../config'
import { modificationRequestRepo } from '../../dataAccess'
import { makeProjectIdentifier } from '../../entities/project'
import { fillDocxTemplate } from '../../helpers/fillDocxTemplate'
import { formatDate } from '../../helpers/formatDate'
import { ResponseTemplateDownloaded } from '../../modules/modificationRequest'
import routes from '../../routes'
import { getUserProject } from '../../useCases'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'

v1Router.get(
  routes.TELECHARGER_MODELE_REPONSE_RECOURS(),
  ensureLoggedIn(),
  ensureRole(['admin', 'dgec']),
  asyncHandler(async (request, response) => {
    const { projectId, modificationRequestId } = request.params

    // Verify that the current user has the rights to check this out
    const project = await getUserProject({ user: request.user, projectId })

    if (!project) {
      return response.status(404).send('Impossible de générer le fichier demandé.')
    }

    const maybeModificationRequest = await modificationRequestRepo.findById(modificationRequestId)

    if (maybeModificationRequest.is_none()) {
      return response.status(404).send('Impossible de générer le fichier demandé.')
    }

    const modificationRequest = maybeModificationRequest.unwrap()

    const now = new Date()

    const filepath = path.join(
      os.tmpdir(),
      sanitize(
        `${now.getFullYear()}-${now.getMonth() + 1}-${
          now.getDay() + 1
        } - Recours gracieux - ${makeProjectIdentifier(project)}.docx`
      )
    )

    // await makeDirIfNecessary(path.dirname(filepath))

    const templatePath = path.resolve(
      __dirname,
      '../..',
      'views',
      'template',
      'recours-gracieux.docx'
    )

    const soumisAuxGarantiesFinancieres =
      project.appelOffreId === 'Eolien' ||
      project.famille?.garantieFinanciereEnMois ||
      project.famille?.soumisAuxGarantiesFinancieres

    await fillDocxTemplate({
      templatePath,
      outputPath: filepath,
      variables: {
        suiviPar: request.user?.fullName || '???',
        refPotentiel: makeProjectIdentifier(project),
        nomRepresentantLegal: project.nomRepresentantLegal,
        nomCandidat: project.nomCandidat,
        adresseCandidat:
          project.details?.['Adresse postale du contact'] ||
          '!!!ADRESSE CANDIDAT NON DISPONIBLE!!!',
        codePostalProjet: project.codePostalProjet,
        communeProjet: project.communeProjet,
        email: project.email,
        titrePeriode: project.appelOffre?.periode?.title || '!!!AO NON DISPONIBLE!!!',
        titreAppelOffre: project.appelOffre?.title || '!!!AO NON DISPONIBLE!!!',
        familles: project.appelOffre?.familles.length ? 'yes' : '',
        titreFamille: project.familleId,
        nomProjet: project.nomProjet,
        puissance: project.puissance.toString(),
        prixReference: project.prixReference.toString(),
        evaluationCarbone: project.evaluationCarbone.toString(),
        isFinancementParticipatif: project.isFinancementParticipatif ? 'yes' : '',
        isInvestissementParticipatif: project.isInvestissementParticipatif ? 'yes' : '',
        isEngagementParticipatif:
          project.isFinancementParticipatif || project.isInvestissementParticipatif ? 'yes' : '',
        engagementFournitureDePuissanceAlaPointe: project.engagementFournitureDePuissanceAlaPointe
          ? 'yes'
          : '',

        nonInstruit: project.motifsElimination.toLowerCase().includes('non instruit') ? 'yes' : '',
        motifsElimination: project.motifsElimination,

        dateDemande: formatDate(modificationRequest.requestedOn || Date.now()),
        justificationDemande: (modificationRequest as any).justification || '',

        tarifOuPrimeRetenue: project.appelOffre?.tarifOuPrimeRetenue || '!!!AO NON DISPONIBLE!!!',
        tarifOuPrimeRetenueAlt:
          project.appelOffre?.tarifOuPrimeRetenueAlt || '!!!AO NON DISPONIBLE!!!',
        paragraphePrixReference:
          project.appelOffre?.paragraphePrixReference || '!!!AO NON DISPONIBLE!!!',
        affichageParagrapheECS: project.appelOffre?.affichageParagrapheECS ? 'yes' : '',
        unitePuissance: project.appelOffre?.unitePuissance || '!!!AO NON DISPONIBLE!!!',
        eolien: project.appelOffreId === 'Eolien' ? 'yes' : '',
        AOInnovation: project.appelOffreId === 'CRE4 - Innovation' ? 'yes' : '',
        soumisGF: soumisAuxGarantiesFinancieres ? 'yes' : '',
        renvoiSoumisAuxGarantiesFinancieres:
          project.appelOffre?.renvoiSoumisAuxGarantiesFinancieres || '!!!AO NON DISPONIBLE!!!',
        renvoiDemandeCompleteRaccordement:
          project.appelOffre?.renvoiDemandeCompleteRaccordement || '!!!AO NON DISPONIBLE!!!',
        renvoiRetraitDesignationGarantieFinancieres:
          project.appelOffre?.renvoiRetraitDesignationGarantieFinancieres ||
          '!!!AO NON DISPONIBLE!!!',
        paragrapheDelaiDerogatoire:
          project.appelOffre?.paragrapheDelaiDerogatoire || '!!!AO NON DISPONIBLE!!!',
        paragrapheAttestationConformite:
          project.appelOffre?.paragrapheAttestationConformite || '!!!AO NON DISPONIBLE!!!',
        paragrapheEngagementIPFP:
          project.appelOffre?.paragrapheEngagementIPFP || '!!!AO NON DISPONIBLE!!!',
        renvoiModification: project.appelOffre?.renvoiModification || '!!!AO NON DISPONIBLE!!!',
        delaiRealisationTexte:
          project.appelOffre?.delaiRealisationTexte || '!!!AO NON DISPONIBLE!!!',
      },
    })

    await eventStore.publish(
      new ResponseTemplateDownloaded({
        payload: {
          modificationRequestId,
          downloadedBy: request.user.id,
        },
      })
    )

    return response.sendFile(path.resolve(process.cwd(), filepath))
  })
)
