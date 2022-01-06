import React from 'react'
import { ItemDate, TimelineItem, PastIcon, ItemTitle, ContentArea } from './components'
import { AttestationDesignationItem } from '.'

export type DesignationItemProps = {
  isLastItem: boolean
  groupIndex: number
  date: number
  attestation?: {
    date: number
    certificateLink: string
    claimedBy?: string
  }
}

export const DesignationItem = ({
  date,
  isLastItem,
  attestation,
  groupIndex,
}: DesignationItemProps) => (
  <TimelineItem isLastItem={isLastItem} groupIndex={groupIndex}>
    <PastIcon />
    <ContentArea>
      <ItemDate date={date} />
      <ItemTitle title="Notification de résultat" />
      {attestation && <AttestationDesignationItem {...attestation} />}
    </ContentArea>
  </TimelineItem>
)
