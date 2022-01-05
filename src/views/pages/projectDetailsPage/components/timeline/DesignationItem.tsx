import React from 'react'
import { ProjectCertificateDTO, ProjectNotifiedDTO } from '../../../../../modules/frise/dtos'
import { ItemDate, TimelineItem, PastIcon, ItemTitle, ContentArea } from './components'
import { getLatestCertificateEvent } from './helpers'
import { Project } from '../../../../../entities'
import { AttestationDesignationItem } from '.'
import { Certificate } from 'crypto'

export const DesignationItem = (props: {
  isLastItem: boolean
  groupIndex: number
  date: number
  attestation?: {
    date: number
    certificateLink: string
    claimedBy?: string
  }
}) => {
  const { date, isLastItem, attestation, groupIndex } = props

  return (
    <TimelineItem isLastItem={isLastItem} groupIndex={groupIndex}>
      <PastIcon />
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title="Notification de résultat" />
        {attestation && <AttestationDesignationItem {...attestation} />}
      </ContentArea>
    </TimelineItem>
  )
}

const isProjectNotified = (
  event: ProjectCertificateDTO | ProjectNotifiedDTO
): event is ProjectNotifiedDTO => event.type === 'ProjectNotified'
