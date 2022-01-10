import React from 'react'
import { Project } from '../../../../../entities'
import {
  ProjectEventDTO,
  ProjectEventListDTO,
  ProjectGFSubmittedDTO,
} from '../../../../../modules/frise/dtos/ProjectEventListDTO'
import ROUTES from '../../../../../routes'
import { TimelineItem } from './components'
import { DesignationItem } from './DesignationItem'
import { extractDesignationItemProps } from './helpers'
import { extractImportItemProps } from './helpers/extractImportItemProps'
import { ImportItem } from './ImportItem'

export type TimelineProps = {
  projectEventList: ProjectEventListDTO
  projectId: Project['id']
}

function isNotNull<T>(arg: T): arg is Exclude<T, null> {
  return arg !== null
}

export const Timeline = (props: TimelineProps) => {
  const { projectEventList, projectId } = props

  const { events } = projectEventList

  const itemProps = [extractDesignationItemProps(events, projectId), extractImportItemProps(events)]
    .filter(isNotNull)
    .sort((a, b) => a.date - b.date)

  const groupCount = itemProps.length

  return (
    <nav aria-label="Progress">
      <ol role="list" className="overflow-hidden list-none">
        {itemProps
          .map((props) => {
            const { type } = props

            switch (type) {
              case 'designation':
                return <DesignationItem {...props} />

              case 'import':
                return <ImportItem {...props} />

              // case 'garantiesFinancieres':
              //   const { event: gfSubmittedEvent, date } = timelineItem

              //   const documentLink = isProjectGFSubmitted(gfSubmittedEvent)
              //     ? makeGFDocumentLink(gfSubmittedEvent.fileId, gfSubmittedEvent.filename)
              //     : undefined

              //   const dueDate = gfSubmittedEvent.type === 'ProjectGFDueDateSet' ? date : undefined
              //   const deadlineHaspassed = dueDate ? new Date().getTime() > dueDate : undefined

              //   return (
              //     <TimelineItem key={groupIndex} isLastItem={isLastItem}>
              //       <GarantieFinanciereItem
              //         userRole={gfSubmittedEvent.variant}
              //         projectId={projectId}
              //         date={date}
              //         dueDate={dueDate}
              //         deadlineHaspassed={deadlineHaspassed}
              //         documentLink={documentLink}
              //       />
              //     </TimelineItem>
              //   )
            }
          })
          .map((component, groupIndex) => (
            <TimelineItem key={groupIndex} isLastItem={groupIndex === groupCount - 1}>
              {component}
            </TimelineItem>
          ))}
      </ol>
    </nav>
  )
}

const isProjectGFSubmitted = (event: ProjectEventDTO): event is ProjectGFSubmittedDTO =>
  event.type === 'ProjectGFSubmitted'

const makeGFDocumentLink = (fileId: string, filename: string): string => {
  return ROUTES.DOWNLOAD_PROJECT_FILE(fileId, filename)
}
