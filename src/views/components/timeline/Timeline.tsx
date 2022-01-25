import React from 'react'
import { ProjectEventListDTO } from '@modules/frise'
import {
  TimelineItem,
  DesignationItem,
  GFItem,
  ImportItem,
  PTFItem,
  DCRItem,
  ACItem,
} from './components'
import {
  extractACItemProps,
  extractDCRItemProps,
  extractDesignationItemProps,
  extractGFItemProps,
  extractImportItemProps,
  extractPTFItemProps,
} from './helpers'

export type TimelineProps = {
  projectEventList: ProjectEventListDTO
  now: number
}

function isNotNull<T>(arg: T): arg is Exclude<T, null> {
  return arg !== null
}

export const Timeline = ({
  projectEventList: {
    events,
    project: { id: projectId, isLaureat },
  },
  now,
}: TimelineProps) => {
  const itemProps = [
    extractDesignationItemProps(events, projectId),
    extractImportItemProps(events),
    extractGFItemProps(events, now),
    extractDCRItemProps(events, now),
    extractPTFItemProps(events, { isLaureat }),
    extractACItemProps(events),
  ]
    .filter(isNotNull)
    .sort(sortItemProps)

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

              case 'garanties-financieres':
                return <GFItem {...{ ...props, projectId }} />

              case 'demande-complete-de-raccordement':
                return <DCRItem {...{ ...props, projectId }} />

              case 'proposition-technique-et-financiere':
                return <PTFItem {...{ ...props, projectId }} />

              case 'attestation-de-conformite':
                return <ACItem {...props} />
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

const hasDateProperty = (props: unknown): props is { date: any } =>
  props && typeof props === 'object' ? props.hasOwnProperty('date') : false

const sortItemProps = (a: unknown, b: unknown) => {
  const A_IS_GREATER_THAN_B = 1
  const A_IS_LESS_THAN_B = -1

  if (!hasDateProperty(a)) {
    return A_IS_GREATER_THAN_B
  }

  if (!hasDateProperty(b)) {
    return A_IS_LESS_THAN_B
  }

  return a.date - b.date
}
