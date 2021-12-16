import {
  ProjectCertificateGeneratedDTO,
  ProjectCertificateRegeneratedDTO,
  ProjectCertificateUpdatedDTO,
  ProjectEventDTO,
  ProjectEventListDTO,
  ProjectImportedDTO,
  ProjectNotifiedDTO,
} from '../../../../../../modules/frise/dtos/ProjectEventListDTO'

type TimelineItem = DesignationItem | ImportItem

type DesignationItem = {
  type: 'designation'
  events: (
    | ProjectNotifiedDTO
    | ProjectCertificateGeneratedDTO
    | ProjectCertificateRegeneratedDTO
    | ProjectCertificateUpdatedDTO
  )[]
  date: number
}

type ImportItem = {
  type: 'import'
  events: ProjectImportedDTO[]
  date: number
}

const isDesignation = (item: TimelineItem): item is DesignationItem => item.type === 'designation'

type TimelineItemList = TimelineItem[]

type MapTimelineItemList = (projectEventList: ProjectEventListDTO) => TimelineItemList

export const mapTimelineItemList: MapTimelineItemList = (projectEventList) => {
  const timelineItemList: TimelineItemList = []
  const { events } = projectEventList

  for (const event of events) {
    makeDesignationPackage(event)
    makeImportPackage(event)
  }

  function makeDesignationPackage(event: ProjectEventDTO) {
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
        const designation = timelineItemList.find(isDesignation)
        designation?.events.push(event)
        break
    }
  }

  function makeImportPackage(event: ProjectEventDTO) {
    switch (event.type) {
      case 'ProjectImported':
        const hasDesignation = timelineItemList.some(isDesignation)
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
