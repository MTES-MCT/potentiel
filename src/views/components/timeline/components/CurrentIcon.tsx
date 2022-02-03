import React from 'react'

export const CurrentIcon = () => (
  <div className="h-9 flex items-center" aria-hidden="true">
    <span
      className={
        'relative z-2 w-8 h-8 flex items-center justify-center bg-white border-2 border-solid rounded-full border-blue-700 group-hover:border-blue-900'
      }
    >
      <span className={'h-2.5 w-2.5 rounded-full bg-blue-700'} />
    </span>
  </div>
)
