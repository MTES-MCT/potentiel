import React, { FC } from 'react'

type BadgeType = 'success' | 'error' | 'info' | 'warning'

type BadgeProps = {
  className: string
  type: BadgeType
}

export const Badge: FC<BadgeProps> = ({ type, className, children }) => (
  <span
    className={`inline-flex self-start px-2 py-1 rounded-md text-sm font-bold uppercase bg-${type}-950-base text-${type}-425-base ${className}`}
  >
    {children}
  </span>
)
