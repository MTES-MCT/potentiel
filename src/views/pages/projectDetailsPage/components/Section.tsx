import { IconType } from '@react-icons/all-files/lib'
import { Heading2 } from '@views/components'
import React from 'react'

type SectionProps = {
  title: string
  icon?: string
  Icon?: IconType
  children: React.ReactNode
}

export const Section = ({ title, children, icon, Icon }: SectionProps) => (
  <div className="panel p-4 flex-1 xs:w-full min-w-fit">
    <Heading2 className="flex items-center section--title text-2xl">
      {Icon && <Icon className="mr-[10px]" />}
      {icon && (
        <svg className="icon section-icon">
          <use xlinkHref={'#' + icon}></use>
        </svg>
      )}
      {title}
    </Heading2>
    {children}
  </div>
)
