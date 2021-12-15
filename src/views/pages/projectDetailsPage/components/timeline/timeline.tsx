import React from 'react'
import { User } from '../../../../../entities'
import { ProjectEventListDTO } from '../../../../../modules/frise/dtos/ProjectEventListDTO'
import { mapTimelineItemList } from './helpers'
import { DesignationItem } from './DesignationItem'
import { ImportItem } from './ImportItem'
import { ProjectDataForProjectPage } from '../../../../../modules/project/dtos'

export const Timeline = (props: {
  projectEventList: ProjectEventListDTO
  user: User
  project: ProjectDataForProjectPage
}) => {
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
                <DesignationItem
                  events={timelineItem.events}
                  isLastItem={isLastItem}
                  project={props.project}
                  user={props.user}
                />
              )
            case 'import':
              return <ImportItem event={timelineItem.events[0]} isLastItem={isLastItem} />
          }
        })}
      </ol>
    </nav>
  )
}
