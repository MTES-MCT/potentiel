import React from 'react'
import { formatDate } from '../../../../../helpers/formatDate'
import { AttestationDesignationItemProps } from './helpers/extractDesignationItemProps'

export const AttestationDesignationItem = ({
  date,
  source,
  url: certificateLink,
}: AttestationDesignationItemProps) => (
  <a href={certificateLink} download>
    {source === 'uploaded' ? (
      <span>
        Télécharger l'attestation de désignation (transmise le {formatDate(date)})
      </span>
    ) : (
      <span>Télécharger l'attestation de désignation (éditée le {formatDate(date)})</span>
    )}
  </a>
)
