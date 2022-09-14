import React, { ComponentProps } from 'react'
import { InfoIcon } from '../atoms'

export type InfoBoxProps = ComponentProps<'div'> & { title?: string }

export const InfoBox = ({ title, children, className = '', ...props }: InfoBoxProps) => {
  return (
    <div className={`flex ${className}`} {...props}>
      <div className="bg-info-425-base">
        <InfoIcon className="fill-white text-2xl mx-2 mt-4" />
      </div>
      <div className="pl-5 pr-8 py-4 border-solid border-1 border-info-425-base">
        {title && (
          <>
            <span className="text-base font-semibold mb-2 inline-block">{title}</span>
            <br />
          </>
        )}
        {children}
      </div>
    </div>
  )
}
