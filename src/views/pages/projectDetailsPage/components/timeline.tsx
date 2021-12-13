import React from 'react'
import { ProjectEventListDTO } from '../../../../modules/frise/dtos/ProjectEventListDTO'
import { User } from '../../../../entities'
import { TimelineNotificationItem } from './timelineNotificationItem'

export const Timeline = (props: { projectEventList: ProjectEventListDTO; user: User }) => {
  const userCanVisualizeNotificationDate = !['ademe'].includes(props.user.role)
  const eventCount = props.projectEventList.events.length
  return (
    <nav aria-label="Progress">
      <ol role="list" className="overflow-hidden list-none">
        {props.projectEventList.events.map(
          (event, eventIndex) =>
            userCanVisualizeNotificationDate && (
              <TimelineNotificationItem event={event} isLastItem={eventIndex === eventCount - 1} />
            )
        )}
      </ol>
    </nav>
  )
}
