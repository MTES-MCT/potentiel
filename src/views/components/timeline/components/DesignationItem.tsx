import React from 'react'
import { ItemDate, PastIcon, ItemTitle, ContentArea } from './components'
import { AttestationDesignationItem } from '.'
import { DesignationItemProps } from './helpers/extractDesignationItemProps'

export const DesignationItem = ({ date, certificate: attestation }: DesignationItemProps) => (
  <>
    <PastIcon />
    <ContentArea>
      <ItemDate date={date} />
      <ItemTitle title="Notification de résultat" />
      {attestation && <AttestationDesignationItem {...attestation} />}
    </ContentArea>
  </>
)
