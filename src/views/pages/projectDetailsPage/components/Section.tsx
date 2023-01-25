import { Heading2 } from '@views/components'
import React from 'react'
import { dataId } from '../../../../helpers/testId'

interface SectionProps {
  title: string
  defaultOpen?: boolean
  icon?: string
  children: React.ReactNode
}

export const Section = ({ title, defaultOpen, children, icon }: SectionProps) => {
  return (
    <div className="panel p-4 flex-1 xs:w-full min-w-fit" {...dataId('projectDetails-section')}>
      <Heading2 className={'section--title text-2xl'} {...dataId('visibility-toggle')}>
        {icon ? (
          <svg className="icon section-icon">
            <use xlinkHref={'#' + icon}></use>
          </svg>
        ) : (
          ''
        )}
        {title}
      </Heading2>
      <div className="" {...dataId('projectDetails-section-content')}>
        {children}
      </div>
    </div>
  )
}
