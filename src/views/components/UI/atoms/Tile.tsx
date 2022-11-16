import React, { FC } from 'react'

type TileProps = {
  className?: string
  children?: React.ReactNode
}

export const Tile: FC<TileProps> = ({ children, className = '' }) => (
  <div
    className={`p-5 border border-solid border-grey-925-base border-b-[3px] border-b-blue-france-sun-base ${className}`}
  >
    {children}
  </div>
)
