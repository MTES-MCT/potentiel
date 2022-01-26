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
  CAItem,
  CRItem,
  MeSItem,
} from './components'
import {
  extractACItemProps,
  extractCAItemProps,
  extractCRItemProps,
  extractDCRItemProps,
  extractDesignationItemProps,
  extractGFItemProps,
  extractImportItemProps,
  extractMeSItemProps,
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
  const itemPropsGroup1 = [
    extractDesignationItemProps(events, projectId),
    extractImportItemProps(events),
    extractGFItemProps(events, now),
    extractDCRItemProps(events, now),
    extractPTFItemProps(events, { isLaureat }),
    extractCRItemProps(events, { isLaureat }),
  ]
    .filter(isNotNull)
    .sort(sortItemProps)

  const group1Count = itemPropsGroup1.length

  const itemPropsGroup2 = [
    extractACItemProps(events),
    extractMeSItemProps(events, { isLaureat }),
    extractCAItemProps(events, { isLaureat }),
  ]
    .filter(isNotNull)
    .sort(sortItemProps)

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

              case 'convention-de-raccordement':
                return <CRItem />
            }
          })
          .map((component, groupIndex) => (
            <TimelineItem key={groupIndex} isLastItem={groupIndex === group1Count}>
              {component}
            </TimelineItem>
          ))}
      </ol>
      <ol role="list" className="pl-0 overflow-hidden list-none -mt-0.5">
        {itemPropsGroup2
          .map((props) => {
            const { type } = props

            switch (type) {
              case 'attestation-de-conformite':
                return <ACItem {...props} />

              case 'mise-en-service':
                return <MeSItem />

              case 'contrat-achat':
                return <CAItem />
            }
          })
          .map((component, groupIndex) => (
            <TimelineItem key={groupIndex} isLastItem={groupIndex === 2}>
              {component}
            </TimelineItem>
          ))}
      </ol>
    </aside>
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
