import React from 'react'
import { ItemDate, PastIcon, ItemTitle, ContentArea } from '.'
import { DesignationItemProps } from '../helpers/extractDesignationItemProps'
import { formatDate } from '../../../../helpers/formatDate'
import { Link } from '@components'

export const DesignationItem = ({
  certificate,
  role,
  date,
  projectStatus,
}: DesignationItemProps) => (
  <>
    <PastIcon />
    <ContentArea>
      <ItemDate date={date} />
      <ItemTitle title="Notification des résultats" />
      {certificate ? (
        <Certificate {...{ certificate, role, projectStatus }} />
      ) : (
        role === 'porteur-projet' && <span>Votre attestation sera disponible sous 24h</span>
      )}
    </ContentArea>
  </>
)

type CertificateProps = {
  certificate: Exclude<DesignationItemProps['certificate'], undefined>
  projectStatus: DesignationItemProps['projectStatus']
}

const Certificate = ({ certificate, projectStatus }: CertificateProps) => {
  const { status } = certificate

  if (status === 'not-applicable') {
    return <p>Attestation non disponible pour cette période</p>
  }

  const { url, date } = certificate

  const urlTitle =
    projectStatus === 'Eliminé'
      ? status === 'generated'
        ? `avis de rejet (édité`
        : `avis de rejet (transmis`
      : status === 'generated'
      ? `attestation de désignation (éditée`
      : `attestation de désignation (transmise`
  return (
    <Link href={url} download>
      {`Télécharger l'${urlTitle} le ${formatDate(date)})`}
    </Link>
  )
}
