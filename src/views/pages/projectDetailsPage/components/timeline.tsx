import React from 'react'
import { ProjectEventListDTO } from '../../../../modules/frise/dtos/ProjectEventListDTO'
import { TimelineNotificationItem } from './timelineNotificationItem'

export const Timeline = (props: { projectEventList: ProjectEventListDTO }) => {
  const eventCount = props.projectEventList.events.length
  return (
    <nav aria-label="Progress">
      <ol role="list" className="overflow-hidden list-none">
        {props.projectEventList.events.map((event, eventIndex) => (
          <TimelineNotificationItem event={event} isLastItem={eventIndex === eventCount - 1} />
        ))}
      </ol>
    </nav>
  )
}
