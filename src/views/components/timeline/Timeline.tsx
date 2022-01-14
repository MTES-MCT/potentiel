import React from 'react'
import { Project } from '../../../entities'
import { ProjectEventListDTO } from '../../../modules/frise/dtos/ProjectEventListDTO'
import {
  TimelineItem,
  DesignationItem,
  DCRItem,
  GarantieFinanciereItem,
  ImportItem,
  PTFItem,
} from './components'
import {
  extractDCRItemProps,
  extractDesignationItemProps,
  extractGFItemProps,
  extractImportItemProps,
  extractPTFItemProps,
} from './helpers'

export type TimelineProps = {
  projectEventList: ProjectEventListDTO
  projectId: Project['id']
  now: number
}

function isNotNull<T>(arg: T): arg is Exclude<T, null> {
  return arg !== null
}

export const Timeline = (props: TimelineProps) => {
  const { projectEventList, projectId, now } = props

  const { events } = projectEventList

  const itemProps = [
    extractDesignationItemProps(events, projectId),
    extractImportItemProps(events),
    extractGFItemProps(events, now),
    extractDCRItemProps(events, now),
    extractPTFItemProps(events),
  ]
    .filter(isNotNull)
    .sort((a, b) => {
      if (a.type === 'proposition-technique-et-financiere' && a.status === 'not-submitted') {
        return 1
      }
      if (b.type === 'proposition-technique-et-financiere' && b.status === 'not-submitted') {
        return -1
      }

      return a.date - b.date
    })

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

              case 'garantiesFinancieres':
                return <GarantieFinanciereItem {...{ ...props, projectId }} />

              case 'demande-complete-de-raccordement':
                return <DCRItem {...{ ...props, projectId }} />

              case 'proposition-technique-et-financiere':
                return <PTFItem {...{ ...props, projectId }} />
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
