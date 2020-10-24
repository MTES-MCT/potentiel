import { NotFoundError, SuccessFileStream, SystemError } from '../helpers/responses'
import { HttpRequest } from '../types'
import { getUserProject } from '../useCases'
import { buildCertificate } from '../views/certificates'

const getCandidateCertificatePreview = async (request: HttpRequest) => {
  try {
    const { projectId } = request.params

    if (!request.user || !['admin', 'dgec'].includes(request.user.role)) {
      // Should never happen, login is verified at the server level
      return SystemError(
        'Seuls les administrateurs connectés peuvent prévisualiser les attestations.'
      )
    }

    // Verify that the current user has the rights to check this out
    const project = await getUserProject({ user: request.user, projectId })

    if (!project) {
      return NotFoundError(
        'Impossible de trouver cette attestation. Etes-vous connecté avec le bon compte de porteur de projet ?'
      )
    }

    if (!project.appelOffre?.periode?.certificateTemplate) {
      return NotFoundError("Impossible de trouver le modèle d'attestation pour ce projet")
    }

    const certificateStreamResult = await buildCertificate(
      project.appelOffre?.periode?.certificateTemplate,
      project
    )

    if (certificateStreamResult.isErr()) {
      console.log(
        'getCandidateCertificatePreview error: cannot generate certificate',
        certificateStreamResult.error
      )
      return SystemError(
        "Erreur lors de la génération de l'attestation: " + certificateStreamResult.error.message
      )
    }

    return SuccessFileStream(certificateStreamResult.value)
  } catch (error) {
    console.log('getCandidateCertificatePreview error', error)
    return SystemError('Impossible de générer le fichier attestation')
  }
}

export { getCandidateCertificatePreview }
