import React from 'react'

import { ExclamationIcon } from '@heroicons/react/solid'

export const CurrentIcon = () => (
  <div className="h-9 flex items-center" aria-hidden="true">
    <span
      className={
        'relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-solid rounded-full border-green-700 group-hover:border-green-900'
      }
    >
      <span className={'h-2.5 w-2.5 rounded-full bg-green-700'} />
    </span>
  </div>
)
