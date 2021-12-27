import React from 'react'
import {
  ProjectEventDTO,
  ProjectGFSubmittedDTO,
} from '../../../../../modules/frise/dtos/ProjectEventListDTO'
import { TimelineItem, ItemTitle, ItemDate, ContentArea, PassedIcon } from './components'
import { GFDocumentLinkItem } from './GFDocumentLinkItem'

export const GarantieFinanciereItem = (props: {
  isLastItem: boolean
  events: ProjectGFSubmittedDTO[]
  groupIndex: number
  date: number
}) => {
  const { isLastItem, events, groupIndex, date } = props
  const projectGFSubmittedEvent = events.find(isProjectGFSubmitted)

  return (
    <TimelineItem isLastItem={isLastItem} groupIndex={groupIndex}>
      <PassedIcon />
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title="Constitution des garanties Financières" />
        {projectGFSubmittedEvent && <GFDocumentLinkItem event={projectGFSubmittedEvent} />}
      </ContentArea>
    </TimelineItem>
  )
}

const isProjectGFSubmitted = (event: ProjectEventDTO): event is ProjectGFSubmittedDTO =>
  event.type === 'ProjectGFSubmitted'
