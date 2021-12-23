import React from 'react'
import { Project } from '../../../../../entities'
import { ProjectEventListDTO } from '../../../../../modules/frise/dtos/ProjectEventListDTO'
import { mapTimelineItemList } from './helpers'
import { DesignationItem } from './DesignationItem'
import { ImportItem } from './ImportItem'
import { GarantieFinanciereItem } from './GarantiesFinancieresItem'

export const Timeline = (props: {
  projectEventList: ProjectEventListDTO
  projectId: Project['id']
}) => {
  const { projectEventList, projectId } = props

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
                  projectId={projectId}
                  groupIndex={groupIndex}
                />
              )
            case 'import':
              return (
                <ImportItem
                  event={timelineItem.events[0]}
                  isLastItem={isLastItem}
                  groupIndex={groupIndex}
                />
              )
            case 'garantiesFinancieres':
              return (
                <GarantieFinanciereItem
                  isLastItem={isLastItem}
                  events={timelineItem.events}
                  groupIndex={groupIndex}
                  date={timelineItem.date}
                />
              )
          }
        })}
      </ol>
    </nav>
  )
}
