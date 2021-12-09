import React from 'react'
import { ProjectEventListDTO } from '../../../../modules/frise/dtos/ProjectEventListDTO'
import { User } from '../../../../entities'
import { TimelineNotificationItem } from './timelineNotificationItem'
import { TimelineProjectImportedItem } from './timelineProjectImportedItem'

export const Timeline = (props: { projectEventList: ProjectEventListDTO; user: User }) => {
  const userHasRightsToSeeProjectImported = ['dgec', 'admin'].includes(props.user.role)
  const userHasRightsToSeeProjectNotified = !['ademe'].includes(props.user.role)
  const eventCount = props.projectEventList.events.length
  return (
    <nav aria-label="Progress">
      <ol role="list" className="overflow-hidden list-none">
        {props.projectEventList.events.map((event, eventIndex) => {
          switch (event.type) {
            case 'ProjectImported':
              return (
                userHasRightsToSeeProjectImported && (
                  <TimelineProjectImportedItem
                    event={event}
                    isLastItem={eventIndex === eventCount - 1}
                  />
                )
              )
            case 'ProjectNotified':
              return (
                userHasRightsToSeeProjectNotified && (
                  <TimelineNotificationItem
                    event={event}
                    isLastItem={eventIndex === eventCount - 1}
                  />
                )
              )
            default:
              return ''
          }
        })}
      </ol>
    </nav>
  )
}
