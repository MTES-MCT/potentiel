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
import { formatDate } from '../helpers/formatDate'
import { Controller, HttpRequest } from '../types'
import ROUTES from '../routes'
import { getUserProject } from '../useCases'
import { makeProjectIdentifier } from '../entities/project'

import { makeCertificate } from '../views/pages/candidateCertificate'
import { modificationRequestRepo } from '../dataAccess'

import fs from 'fs'
import os from 'os'
import util from 'util'
import path from 'path'
const dirExists = util.promisify(fs.exists)
const makeDir = util.promisify(fs.mkdir)
const deleteFile = util.promisify(fs.unlink)
const makeDirIfNecessary = async (dirpath) => {
  const exists = await dirExists(dirpath)
  if (!exists) await makeDir(dirpath)

  return dirpath
}

const getModeleReponseRecours = async (request: HttpRequest) => {
  console.log('Call to getModeleReponseRecours received', request.query)

  try {
    const { projectId, modificationRequestId } = request.params

    if (!request.user) {
      // Should never happen, login is verified at the server level
      return SystemError('Impossible de générer le fichier sans être connecté')
    }

    // Verify that the current user has the rights to check this out
    const project = await getUserProject({ user: request.user, projectId })

    if (!project) {
      return NotFoundError('Impossible de générer le fichier demandé.')
    }

    const maybeModificationRequest = await modificationRequestRepo.findById(
      modificationRequestId
    )

    if (maybeModificationRequest.is_none()) {
      return NotFoundError('Impossible de générer le fichier demandé.')
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
      '../',
      'views',
      'template',
      'Modèle réponse Recours gracieux - dynamique.docx'
    )

    const dateFormat = 'DD/MM/YYYY'

    const soumisAuxGarantiesFinancieres =
      project.appelOffreId === 'Eolien' ||
      project.famille?.garantieFinanciereEnMois ||
      project.famille?.soumisAuxGarantiesFinancieres

    await fillDocxTemplate({
      templatePath,
      outputPath: filepath,
      variables: {
        nomRepresentantLegal: project.nomRepresentantLegal,
        nomCandidat: project.nomCandidat,
        adresseProjet: project.adresseProjet,
        codePostalProjet: project.codePostalProjet,
        communeProjet: project.communeProjet,
        email: project.email,
        titrePeriode:
          project.appelOffre?.periode?.title || '!!!AO NON DISPONIBLE!!!',
        titreAppelOffre: project.appelOffre?.title || '!!!AO NON DISPONIBLE!!!',
        familles: !!project.appelOffre?.familles.length ? 'yes' : '',
        titreFamille: project.familleId,
        nomProjet: project.nomProjet,
        puissance: project.puissance.toString(),
        prixReference: project.prixReference.toString(),
        evaluationCarbone: project.evaluationCarbone.toString(),
        isFinancementParticipatif: project.isFinancementParticipatif
          ? 'yes'
          : '',
        isInvestissementParticipatif: project.isInvestissementParticipatif
          ? 'yes'
          : '',
        isEngagementParticipatif:
          project.isFinancementParticipatif ||
          project.isInvestissementParticipatif
            ? 'yes'
            : '',
        engagementFournitureDePuissanceAlaPointe: project.engagementFournitureDePuissanceAlaPointe
          ? 'yes'
          : '',

        nonInstruit: project.motifsElimination
          .toLowerCase()
          .includes('non instruit')
          ? 'yes'
          : '',
        motifsElimination: project.motifsElimination,

        dateDemande: formatDate(modificationRequest.requestedOn || Date.now()),
        justificationDemande: (modificationRequest as any).justification || '',

        tarifOuPrimeRetenue:
          project.appelOffre?.tarifOuPrimeRetenue || '!!!AO NON DISPONIBLE!!!',
        tarifOuPrimeRetenueAlt:
          project.appelOffre?.tarifOuPrimeRetenueAlt ||
          '!!!AO NON DISPONIBLE!!!',
        paragraphePrixReference:
          project.appelOffre?.paragraphePrixReference ||
          '!!!AO NON DISPONIBLE!!!',
        affichageParagrapheECS: project.appelOffre?.affichageParagrapheECS
          ? 'yes'
          : '',
        unitePuissance:
          project.appelOffre?.unitePuissance || '!!!AO NON DISPONIBLE!!!',
        eolien: project.appelOffreId === 'Eolien' ? 'yes' : '',
        AOInnovation: project.appelOffreId === 'CRE4 - Innovation' ? 'yes' : '',
        soumisGF: soumisAuxGarantiesFinancieres ? 'yes' : '',
        renvoiSoumisAuxGarantiesFinancieres:
          project.appelOffre?.renvoiSoumisAuxGarantiesFinancieres ||
          '!!!AO NON DISPONIBLE!!!',
        renvoiDemandeCompleteRaccordement:
          project.appelOffre?.renvoiDemandeCompleteRaccordement ||
          '!!!AO NON DISPONIBLE!!!',
        renvoiRetraitDesignationGarantieFinancieres:
          project.appelOffre?.renvoiRetraitDesignationGarantieFinancieres ||
          '!!!AO NON DISPONIBLE!!!',
        paragrapheDelaiDerogatoire:
          project.appelOffre?.paragrapheDelaiDerogatoire ||
          '!!!AO NON DISPONIBLE!!!',
        paragrapheAttestationConformite:
          project.appelOffre?.paragrapheAttestationConformite ||
          '!!!AO NON DISPONIBLE!!!',
        paragrapheEngagementIPFP:
          project.appelOffre?.paragrapheEngagementIPFP ||
          '!!!AO NON DISPONIBLE!!!',
        renvoiModification:
          project.appelOffre?.renvoiModification || '!!!AO NON DISPONIBLE!!!',
        delaiRealisationTexte:
          project.appelOffre?.delaiRealisationTexte ||
          '!!!AO NON DISPONIBLE!!!',
      },
    })

    return SuccessFile(filepath)
  } catch (error) {
    console.log('getModeleReponseRecours error', error)
    return SystemError('Impossible de générer le fichier modèle de recours')
  }
}

export { getModeleReponseRecours }
