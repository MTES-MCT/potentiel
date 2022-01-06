import React, { useState } from 'react'
import {
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
  event: ProjectGFSubmittedDTO | ProjectGFDueDateSetDTO
  groupIndex: number
  date: number
}) => {
  const { isLastItem, event, groupIndex, date, projectId } = props
  const dueDate = event.type === 'ProjectGFDueDateSet' ? event.garantiesFinancieresDueOn : null
  const deadlineHaspassed = dueDate && new Date().getTime() > dueDate
  const displayWarning = deadlineHaspassed && event.variant === 'porteur-projet'
  const [isFormVisible, showForm] = useState(false)

  return (
    <TimelineItem isLastItem={isLastItem} groupIndex={groupIndex}>
      {dueDate ? <CurrentIcon /> : <PastIcon />}
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title="Constitution des garanties Financières" />
        {dueDate && (
          <div>
            <div className="flex">
              <p className="mt-0 mb-0">Garanties financières en attente</p>
              {displayWarning && <WarningItem message="date dépassée" />}
            </div>
            {event.variant === 'porteur-projet' && (
              <>
                <a onClick={() => showForm(!isFormVisible)}>Transmettre l'attestation</a>
                {isFormVisible && (
                  <GFForm
                    projectId={projectId}
                    toggleForm={isFormVisible}
                    setToggleForm={showForm}
                  />
                )}
              </>
            )}
          </div>
        )}
        {event.type === 'ProjectGFSubmitted' && <GFDocumentLinkItem event={event} />}
      </ContentArea>
    </TimelineItem>
  )
}
