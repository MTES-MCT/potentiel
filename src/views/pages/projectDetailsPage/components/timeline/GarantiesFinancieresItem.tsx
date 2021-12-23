import React from 'react'
import { ProjectGFSubmittedDTO } from '../../../../../modules/frise/dtos/ProjectEventListDTO'
import { TimelineItem, ItemTitle, ItemDate, ContentArea, PassedIcon } from './components'
import { GFDocumentLink } from './GFDocumentLink'

export const GarantieFinanciereItem = (props: {
  isLastItem: boolean
  events: ProjectGFSubmittedDTO[]
  groupIndex: number
}) => {
  const { isLastItem, events, groupIndex } = props
  return (
    <TimelineItem isLastItem={isLastItem} groupIndex={groupIndex}>
      <PassedIcon />
      <ContentArea>
        <ItemDate date={events[0].date} />
        <ItemTitle title="Garantie Financière" />
        <GFDocumentLink submittedBy={events[0].submittedBy} />
      </ContentArea>
    </TimelineItem>
  )
}
