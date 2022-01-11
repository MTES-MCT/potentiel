import React from 'react'
import { ItemDate, PastIcon, ItemTitle, ContentArea } from '.'
import { DesignationItemProps } from '../helpers/extractDesignationItemProps'
import { formatDate } from '../../../../helpers/formatDate'

export const DesignationItem = ({ date, certificate: attestation }: DesignationItemProps) => (
  <>
    <PastIcon />
    <ContentArea>
      <ItemDate date={date} />
      <ItemTitle title="Notification de résultat" />
      {attestation && <CertificateLink {...attestation} />}
    </ContentArea>
  </>
)

const CertificateLink = ({
  date,
  source,
  url,
}: Exclude<DesignationItemProps['certificate'], undefined>) => (
  <a href={url} download>
    {source === 'uploaded' ? (
      <span>Télécharger l'attestation de désignation (transmise le {formatDate(date)})</span>
    ) : (
      <span>Télécharger l'attestation de désignation (éditée le {formatDate(date)})</span>
    )}
  </a>
)
