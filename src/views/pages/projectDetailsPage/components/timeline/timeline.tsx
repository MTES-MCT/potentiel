import React from 'react'
import { User } from '../../../../../entities'
import { ProjectEventListDTO } from '../../../../../modules/frise/dtos/ProjectEventListDTO'
import { mapTimelineItemList } from './mapTimelineItemList'
import { TimelineNotificationItem } from './timelineNotificationItem'
import { TimelineProjectImportedItem } from './timelineProjectImportedItem'

export const Timeline = (props: { projectEventList: ProjectEventListDTO; user: User }) => {
  const { projectEventList } = props

  const timelineItemList = mapTimelineItemList(projectEventList).sort((a, b) => a.date - b.date)

  const groupCount = timelineItemList.length

  return (
    <nav aria-label="Progress">
      <ol role="list" className="overflow-hidden list-none">
        {timelineItemList.map((timelineItem, groupIndex) => {
          const isLastItem = groupIndex === groupCount - 1
          switch (timelineItem.type) {
            case 'designation':
              return (
                <TimelineNotificationItem events={timelineItem.events} isLastItem={isLastItem} />
              )
            case 'import':
              return (
                <TimelineProjectImportedItem
                  event={timelineItem.events[0]}
                  isLastItem={isLastItem}
                />
              )
          }
        })}
      </ol>
    </nav>
  )
}
