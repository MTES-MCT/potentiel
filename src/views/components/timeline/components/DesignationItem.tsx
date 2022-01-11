import React from 'react'
import { ItemDate, PastIcon, ItemTitle, ContentArea } from '.'
import { DesignationItemProps } from '../helpers/extractDesignationItemProps'
import { formatDate } from '../../../../helpers/formatDate'

export const DesignationItem = ({ date, certificate }: DesignationItemProps) => (
  <>
    <PastIcon />
    <ContentArea>
      <ItemDate date={date} />
      <ItemTitle title="Notification de résultat" />
      <Certificate {...certificate} />
    </ContentArea>
  </>
)

const Certificate = (props: DesignationItemProps['certificate']) => {
  const { status } = props

  if (status === 'not-applicable') {
    return <span>Attestation non disponible pour cette période</span>
  }

  if (status === 'pending') {
    return <span>Votre attestation sera disponible sous 24h</span>
  }

  const { url, date } = props

  return (
    <a href={url} download>
      {status === 'uploaded'
        ? `Télécharger l'attestation de désignation (transmise le ${formatDate(date)})`
        : `Télécharger l'attestation de désignation (éditée le ${formatDate(date)})`}
    </a>
  )
}
