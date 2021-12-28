import React, { useState } from 'react'
import {
  ProjectEventDTO,
  ProjectGFDueDateSetDTO,
  ProjectGFSubmittedDTO,
} from '../../../../../modules/frise/dtos/ProjectEventListDTO'
import { TimelineItem, ItemTitle, ItemDate, ContentArea, PassedIcon } from './components'
import { GFDocumentLinkItem } from './GFDocumentLinkItem'
import { CurrentIcon } from './components/StateIcons'
import { GFForm } from '.'

export const GarantieFinanciereItem = (props: {
  projectId: string
  isLastItem: boolean
  events: (ProjectGFSubmittedDTO | ProjectGFDueDateSetDTO)[]
  groupIndex: number
  date: number
}) => {
  const { isLastItem, events, groupIndex, date, projectId } = props
  const projectGFDueDateSet = events.find(isProjectGFDueDateSet)
  const projectGFSubmittedEvent = events.find(isProjectGFSubmitted)
  const [isHiddenForm, setIsHiddenForm] = useState(false)

  return (
    <TimelineItem isLastItem={isLastItem} groupIndex={groupIndex}>
      {projectGFSubmittedEvent ? <PassedIcon /> : <CurrentIcon />}
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title="Constitution des garanties Financières" />
        {projectGFDueDateSet && (
          <div>
            <p className="mt-0 mb-0">Garanties financières en attente</p>
            <a onClick={() => setIsHiddenForm(!isHiddenForm)}>Transmettre l'attestation</a>
            {isHiddenForm && (
              <GFForm
                projectId={projectId}
                isHiddenForm={isHiddenForm}
                setIsHiddenForm={setIsHiddenForm}
              />
            )}
          </div>
        )}
        {projectGFSubmittedEvent && <GFDocumentLinkItem event={projectGFSubmittedEvent} />}
      </ContentArea>
    </TimelineItem>
  )
}

const isProjectGFSubmitted = (event: ProjectEventDTO): event is ProjectGFSubmittedDTO =>
  event.type === 'ProjectGFSubmitted'

const isProjectGFDueDateSet = (event: ProjectEventDTO): event is ProjectGFDueDateSetDTO =>
  event.type === 'ProjectGFDueDateSet'
