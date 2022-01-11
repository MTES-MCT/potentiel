import React from 'react'

import { ExclamationIcon } from '@heroicons/react/solid'

export const WarningIcon = () => (
  <div className="h-9 flex items-center" aria-hidden="true">
    <span
      className={
        'relative z-10 w-10 h-10 -left-1 border-solid border-1 border-white flex items-center justify-center bg-yellow-400 rounded-full group-hover:bg-yellow-200'
      }
    >
      <ExclamationIcon className="h-6 w-6 text-white" aria-hidden="true" />
    </span>
  </div>
)
