import React from 'react'
import { CheckIcon } from '@heroicons/react/solid'

export const PassedIcon = () => (
  <div className="h-9 flex items-center" aria-hidden="true">
    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-green-700 rounded-full group-hover:bg-green-900">
      <CheckIcon className="w-5 h-5 text-white" />
    </span>
  </div>
)

export const CurrentIcon = () => (
  <div className="h-9 flex items-center" aria-hidden="true">
    <span
      className={
        'relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-solid border-green-700 rounded-full group-hover:border-green-900'
      }
    >
      <span className={'h-2.5 w-2.5 bg-green-700 rounded-full'} />
    </span>
  </div>
)
