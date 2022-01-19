import React from 'react'
import { ItemDate, PastIcon, ItemTitle, ContentArea } from '.'
import { DesignationItemProps } from '../helpers/extractDesignationItemProps'
import { formatDate } from '../../../../helpers/formatDate'

export const DesignationItem = (props: DesignationItemProps & { projectId: string }) => {
  const { certificate, role, date } = props
  return (
    <>
      <PastIcon />
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title="Notification de résultat" />
        <Certificate certificate={certificate} role={role} />
      </ContentArea>
    </>
  )
}

type CertificateProps = {
  certificate: DesignationItemProps['certificate']
  role: DesignationItemProps['role']
}

const Certificate = ({ certificate, role }: CertificateProps) => {
  const { status } = certificate

  const message =
    status === 'not-applicable'
      ? 'Attestation non disponible pour cette période'
      : role === 'admin'
      ? 'Document non disponible actuellement'
      : 'Votre attestation sera disponible sous 24h'

  if (status === 'not-applicable' || status === 'pending') {
    return <span>{message}</span>
  }

  const { url, date } = certificate

  return (
    <a href={url} download>
      {status === 'uploaded'
        ? `Télécharger l'attestation de désignation (transmise le ${formatDate(date)})`
        : `Télécharger l'attestation de désignation (éditée le ${formatDate(date)})`}
    </a>
  )
}
