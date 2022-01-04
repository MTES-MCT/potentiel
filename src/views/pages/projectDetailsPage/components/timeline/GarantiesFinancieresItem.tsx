import React, { useState } from 'react'
import {
  ProjectEventDTO,
  ProjectGFDueDateSetDTO,
  ProjectGFSubmittedDTO,
} from '../../../../../modules/frise/dtos/ProjectEventListDTO'
import { TimelineItem, ItemTitle, ItemDate, ContentArea, PastIcon, CurrentIcon } from './components'
import { GFDocumentLinkItem } from './GFDocumentLinkItem'
import { GFForm } from '.'
import { WarningItem } from './components/WarningItem'

export const GarantieFinanciereItem = (props: {
  projectId: string
  isLastItem: boolean
  events: (ProjectGFSubmittedDTO | ProjectGFDueDateSetDTO)[]
  groupIndex: number
  date: number
}) => {
  const { isLastItem, events, groupIndex, date, projectId } = props
  const projectGFDueDateSet = events.find(isProjectGFDueDateSet)
  const dueDate = projectGFDueDateSet?.garantiesFinancieresDueOn
  const today = new Date().getTime()
  const displayWarning =
    projectGFDueDateSet?.variant === 'porteur-projet' && dueDate && today >= dueDate ? true : false
  const projectGFSubmittedEvent = events.find(isProjectGFSubmitted)
  const [toggleForm, setToggleForm] = useState(false)

  return (
    <TimelineItem isLastItem={isLastItem} groupIndex={groupIndex}>
      {projectGFSubmittedEvent ? <PastIcon /> : <CurrentIcon />}
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title="Constitution des garanties Financières" />
        {projectGFDueDateSet && (
          <div>
            <div className="flex">
              <p className="mt-0 mb-0">Garanties financières en attente</p>
              {displayWarning && <WarningItem message="date dépassée" />}
            </div>
            {projectGFDueDateSet.variant === 'porteur-projet' && (
              <>
                <a onClick={() => setToggleForm(!toggleForm)}>Transmettre l'attestation</a>
                {toggleForm && (
                  <GFForm
                    projectId={projectId}
                    toggleForm={toggleForm}
                    setToggleForm={setToggleForm}
                  />
                )}
              </>
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
