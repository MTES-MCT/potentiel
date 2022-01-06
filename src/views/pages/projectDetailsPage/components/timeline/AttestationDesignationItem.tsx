import React from 'react'
import { formatDate } from '../../../../../helpers/formatDate'

type AttestationDesignationItemProps = {
  date: number
  certificateLink: string
  claimedBy?: string
}

export const AttestationDesignationItem = ({
  date,
  claimedBy,
  certificateLink,
}: AttestationDesignationItemProps) => (
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
