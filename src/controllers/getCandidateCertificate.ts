import {
  Redirect,
  Success,
  SuccessFile,
  SystemError,
  NotFoundError,
} from '../helpers/responses'
import { projectRepo, appelsOffreStatic } from '../dataAccess'
import { Controller, HttpRequest } from '../types'
import ROUTES from '../routes'
import { getUserProject } from '../useCases'

import { makeCertificate } from '../views/pages/candidateCertificate'

const getCandidateCertificate = async (request: HttpRequest) => {
  console.log(
    'Call to getCandidateCertificate received',
    request.query,
    request.file
  )

  try {
    const { projectId } = request.params

    if (!request.user) {
      // Should never happen, login is verified at the server level
      return SystemError(
        'Impossible de générer le fichier attestation sans être connecté'
      )
    }

    const project = await getUserProject({ user: request.user, projectId })

    if (!project) {
      return NotFoundError(
        'Impossible de trouver cette attestation. Etes-vous connecté avec le bon compte de porteur de projet ?'
      )
    }

    const appelOffre = appelsOffreStatic.find(
      (appelOffre) => appelOffre.id === project.appelOffreId
    )

    if (!appelOffre) {
      return SystemError('Impossible de générer le fichier attestation (AO)')
    }

    const periode = appelOffre.periodes.find(
      (periode) => periode.id === project.periodeId
    )
    if (!periode) {
      return SystemError(
        'Impossible de générer le fichier attestation (Période)'
      )
    }
    // console.log('Found project', project)

    // Verify that the current user has the rights to check this out

    // TODO: create a use-case to check rights and retrieve project if rights ok ?

    const location = `temp/attestation-${projectId}.pdf`
    await makeCertificate({
      destination: location,
      project,
      appelOffre,
      periode,
    })

    return SuccessFile(location)
  } catch (error) {
    console.log('getCandidateCertificate error', error)
    return SystemError('Impossible de générer le fichier attestation')
  }
}

export { getCandidateCertificate }
