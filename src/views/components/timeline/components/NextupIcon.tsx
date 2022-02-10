import React from 'react'

import { ClockIcon } from '@heroicons/react/solid'

export const NextUpIcon = () => (
  <div className="h-9 flex items-center" aria-hidden="true">
    <span
      className={'relative z-2 w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full'}
    >
      <ClockIcon className="h-5 w-5 text-white" aria-hidden="true" />
    </span>
  </div>
)
