import React from 'react'
import { formatDate } from '../../../../../helpers/formatDate'
import { ProjectCertificateDTO, ProjectClaimedDTO } from '../../../../../modules/frise/dtos'
import { Project } from '../../../../../entities'
import ROUTES from '../../../../../routes'

export const AttestationDesignationItem = (props: {
  date: number
  certificateLink: string
  claimedBy?: string
}) => {
  const { date, claimedBy, certificateLink } = props

  return (
    <a href={certificateLink} download>
      {claimedBy ? (
        <span>
          Télécharger l'attestation de désignation (transmise le {formatDate(date)} par {claimedBy})
        </span>
      ) : (
        <span>Télécharger l'attestation de désignation (éditée le {formatDate(date)})</span>
      )}
    </a>
  )
}

const isProjectClaimed = (event: ProjectCertificateDTO): event is ProjectClaimedDTO =>
  event.type === 'ProjectClaimed'

const makeCertificateLink = (
  latestCertificateEvent: ProjectCertificateDTO,
  projectId: Project['id']
) => {
  const { certificateFileId, nomProjet, potentielIdentifier, variant } = latestCertificateEvent
  if (variant === 'admin' || variant === 'dgec') {
    return ROUTES.CANDIDATE_CERTIFICATE_FOR_ADMINS({
      id: projectId,
      certificateFileId,
      email: latestCertificateEvent.email,
      potentielIdentifier,
    })
  }

  return ROUTES.CANDIDATE_CERTIFICATE_FOR_CANDIDATES({
    id: projectId,
    certificateFileId,
    nomProjet,
    potentielIdentifier,
  })
}
