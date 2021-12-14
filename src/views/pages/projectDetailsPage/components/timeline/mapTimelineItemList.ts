import {
  ProjectEventDTO,
  ProjectEventListDTO,
} from '../../../../../modules/frise/dtos/ProjectEventListDTO'

type TimelineItem = {
  events: ProjectEventDTO[]
  date?: number
  type: 'designation' | 'import'
}

type TimelineItemList = TimelineItem[]

type MapTimelineItemList = (projectEventList: ProjectEventListDTO) => TimelineItemList

export const mapTimelineItemList: MapTimelineItemList = (projectEventList) => {
  const timelineItemList: TimelineItemList = []
  const { events } = projectEventList

  for (const event of events) {
    switch (event.type) {
      case 'ProjectNotified':
        timelineItemList.push({
          events: [event],
          date: event.date,
          type: 'designation',
        })
        const importIndex = timelineItemList.findIndex((group) => group.type === 'import')
        if (importIndex !== -1) {
          timelineItemList.splice(importIndex, 1)
        }
        break
      case 'ProjectCertificateGenerated':
      case 'ProjectCertificateRegenerated':
      case 'ProjectCertificateUpdated':
        const designation = timelineItemList.find((item) => item.type === 'designation')
        designation?.events.push(event)
        break
      case 'ProjectImported':
        const hasDesignation = timelineItemList.some((item) => item.type === 'designation')
        if (!hasDesignation) {
          timelineItemList.push({
            events: [event],
            date: event.date,
            type: 'import',
          })
        }
        break
    }
  }

  return timelineItemList
}
