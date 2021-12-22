import React from 'react'
import { formatDate } from '../../../../../helpers/formatDate'
import { ProjectCertificateDTO } from '../../../../../modules/frise/dtos'
import { makeCertificateLink } from './helpers'
import { Project } from '../../../../../entities'

export const AttestationDesignationItem = (props: {
  latestCertificateEvent: ProjectCertificateDTO
  projectId: Project['id']
}) => {
  const { latestCertificateEvent, projectId } = props
  const certificateLink = makeCertificateLink(latestCertificateEvent, projectId)
  return (
    <a href={certificateLink}>
      {latestCertificateEvent.type === 'ProjectClaimed' ? (
        <span>
          Télécharger l'attestation de désignation (transmise le{' '}
          {formatDate(latestCertificateEvent.date)} par {latestCertificateEvent.claimedBy})
        </span>
      ) : (
        <span>
          Télécharger l'attestation de désignation (éditée le{' '}
          {formatDate(latestCertificateEvent.date)})
        </span>
      )}
    </a>
  )
}
