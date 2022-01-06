import React from 'react'
import { ItemDate, PastIcon, ItemTitle, ContentArea } from './components'
import { AttestationDesignationItem } from '.'

export type DesignationItemProps = {
  date: number
  attestation?: {
    date: number
    certificateLink: string
    claimedBy?: string
  }
}
export const DesignationItem = ({ date, attestation }: DesignationItemProps) => (
  <>
    <PastIcon />
    <ContentArea>
      <ItemDate date={date} />
      <ItemTitle title="Notification de résultat" />
      {attestation && <AttestationDesignationItem {...attestation} />}
    </ContentArea>
  </>
)
