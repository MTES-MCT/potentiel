import { UniqueEntityID } from '../core/domain'
import { NotFoundError, SuccessFileStream, SystemError } from '../helpers/responses'
import { toProjectDataForCertificate } from '../modules/project/mappers'
import { ProjectProps } from '../modules/project/Project'
import { HttpRequest } from '../types'
import { getUserProject } from '../useCases'
import { buildCertificate } from '../views/certificates'
import { logger } from '../core/utils'

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

    if (!project.appelOffre?.periode?.isNotifiedOnPotentiel) {
      return NotFoundError("Impossible de trouver le modèle d'attestation pour ce projet")
    }

    const projectDataResult = toProjectDataForCertificate({
      appelOffre: project.appelOffre,
      isClasse: project.classe === 'Classé',
      notifiedOn: project.notifiedOn,
      projectId: new UniqueEntityID(project.id),
      data: project as unknown,
    } as ProjectProps)

    if (projectDataResult.isErr()) {
      logger.error(projectDataResult.error)
      return NotFoundError("Impossible de générer l'attestion parce qu'il manque des données.")
    }

    const certificateStreamResult = await buildCertificate({
      template: project.appelOffre.periode.certificateTemplate,
      data: projectDataResult.value,
    })

    if (certificateStreamResult.isErr()) {
      logger.error(certificateStreamResult.error)
      return SystemError(
        "Erreur lors de la génération de l'attestation: " + certificateStreamResult.error.message
      )
    }

    return SuccessFileStream(certificateStreamResult.value)
  } catch (error) {
    logger.error(error)
    return SystemError('Impossible de générer le fichier attestation')
  }
}

export { getCandidateCertificatePreview }
