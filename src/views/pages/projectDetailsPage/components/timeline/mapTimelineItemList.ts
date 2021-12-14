import {
  ProjectEventDTO,
  ProjectEventListDTO,
} from '../../../../../modules/frise/dtos/ProjectEventListDTO'

type TimelineItem = {
  events: ProjectEventDTO[]
  date?: number
  type: 'designation'
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
        break
      case 'ProjectCertificateGenerated':
      case 'ProjectCertificateRegenerated':
        const designation = timelineItemList.find((item) => item.type === 'designation')
        designation?.events.push(event)
        break
      default:
        timelineItemList.push({
          events: [event],
          date: event.date,
          type: 'designation',
        })
    }
  }

  return timelineItemList
}
