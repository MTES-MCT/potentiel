import { IconType } from '@react-icons/all-files/lib'
import { Heading2 } from '@views/components'
import React from 'react'

type SectionProps = {
  title: string
  icon?: IconType
  children: React.ReactNode
}

export const Section = ({ title, children, icon: Icon }: SectionProps) => (
  <div className="m-0 p-4 flex-1 xs:w-full min-w-fit border border-solid border-grey-900-base">
    <Heading2 className="flex items-center text-2xl border-solid border-x-0 border-t-0 border-b-[1px] border-b-grey-900-base">
      {Icon && <Icon className="mr-[10px]" />}
      {title}
    </Heading2>
    {children}
  </div>
)
