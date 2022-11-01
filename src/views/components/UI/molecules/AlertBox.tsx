import React, { ComponentProps, FC } from 'react'
import { WarningIcon } from '../atoms'

type AlertBoxProps = ComponentProps<'div'> & { title?: string }

export const AlertBox: FC<AlertBoxProps> = ({
  title,
  children,
  className = '',
  ...props
}: AlertBoxProps) => {
  return (
    <div className={`flex ${className}`} {...props}>
      <div className="bg-warning-425-base">
        <WarningIcon className="text-white text-3xl mx-2 mt-4" />
      </div>
      <div className="pl-5 pr-8 py-4 border-solid border-1 border-warning-425-base">
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
