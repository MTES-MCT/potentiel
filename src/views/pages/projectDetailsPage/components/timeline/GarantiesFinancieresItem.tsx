import React from 'react'
import {
  ProjectEventDTO,
  ProjectGFDueDateSetDTO,
  ProjectGFSubmittedDTO,
} from '../../../../../modules/frise/dtos/ProjectEventListDTO'
import { TimelineItem, ItemTitle, ItemDate, ContentArea, PassedIcon } from './components'
import { GFDocumentLinkItem } from './GFDocumentLinkItem'
import { CurrentIcon } from './components/StateIcons'

export const GarantieFinanciereItem = (props: {
  isLastItem: boolean
  events: (ProjectGFSubmittedDTO | ProjectGFDueDateSetDTO)[]
  groupIndex: number
  date: number
}) => {
  const { isLastItem, events, groupIndex, date } = props
  const projectGFDueDateSet = events.find(isProjectGFDueDateSet)
  const projectGFSubmittedEvent = events.find(isProjectGFSubmitted)

  return (
    <TimelineItem isLastItem={isLastItem} groupIndex={groupIndex}>
      {projectGFSubmittedEvent ? <PassedIcon /> : <CurrentIcon />}
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title="Constitution des garanties Financières" />
        {projectGFDueDateSet && <p className="mt-0 mb-0">Garanties financières en attente</p>}
        {projectGFSubmittedEvent && <GFDocumentLinkItem event={projectGFSubmittedEvent} />}
      </ContentArea>
    </TimelineItem>
  )
}

const isProjectGFSubmitted = (event: ProjectEventDTO): event is ProjectGFSubmittedDTO =>
  event.type === 'ProjectGFSubmitted'

const isProjectGFDueDateSet = (event: ProjectEventDTO): event is ProjectGFDueDateSetDTO =>
  event.type === 'ProjectGFDueDateSet'
