import React from 'react'
import { ItemDate, PastIcon, ItemTitle, ContentArea } from '.'
import { DesignationItemProps } from '../helpers/extractDesignationItemProps'
import { formatDate } from '../../../../helpers/formatDate'

export const DesignationItem = ({ certificate, role, date }: DesignationItemProps) => (
  <>
    <PastIcon />
    <ContentArea>
      <ItemDate date={date} />
      <ItemTitle title="Notification de résultat" />
      {certificate && <Certificate {...{ certificate, role }} />}
    </ContentArea>
  </>
)

type CertificateProps = {
  certificate: Exclude<DesignationItemProps['certificate'], undefined>
  role: DesignationItemProps['role']
}

const Certificate = ({ certificate, role }: CertificateProps) => {
  const { status } = certificate

  switch (status) {
    case 'not-applicable':
      return <NotApplicable />
    case 'pending':
      return <Pending role={role} />
    case 'generated':
      return <Generated {...certificate} />
    case 'uploaded':
      return <Uploaded {...certificate} />
  }
}

const NotApplicable = () => <span>Attestation non disponible pour cette période</span>

type PendingProps = {
  role: DesignationItemProps['role']
}
const Pending = ({ role }: PendingProps) => (
  <span>
    {role === 'admin'
      ? 'Document non disponible actuellement'
      : 'Votre attestation sera disponible sous 24h'}
  </span>
)

type GeneratedProps = {
  url: string
  date: number
}
const Generated = ({ url, date }: GeneratedProps) => (
  <a href={url} download>
    Télécharger l'attestation de désignation (éditée le {formatDate(date)})
  </a>
)

type UploadedProps = {
  url: string
  date: number
}
const Uploaded = ({ url, date }: UploadedProps) => (
  <a href={url} download>
    Télécharger l'attestation de désignation (transmise le {formatDate(date)})
  </a>
)
