import React from 'react'
import { ProjectGFSubmittedDTO } from '../../../../../modules/frise/dtos/ProjectEventListDTO'
import { TimelineItem, ItemTitle, ItemDate, ContentArea, PassedIcon } from './components'
import { GFDocumentLinkItem } from './GFDocumentLinkItem'

export const GarantieFinanciereItem = (props: {
  isLastItem: boolean
  events: ProjectGFSubmittedDTO[]
  groupIndex: number
}) => {
  const { isLastItem, events, groupIndex } = props
  const { submittedBy, fileId, filename } = events[0]
  return (
    <TimelineItem isLastItem={isLastItem} groupIndex={groupIndex}>
      <PassedIcon />
      <ContentArea>
        <ItemDate date={events[0].date} />
        <ItemTitle title="Garantie Financière" />
        <GFDocumentLinkItem submittedBy={submittedBy} fileId={fileId} filename={filename} />
      </ContentArea>
    </TimelineItem>
  )
}
