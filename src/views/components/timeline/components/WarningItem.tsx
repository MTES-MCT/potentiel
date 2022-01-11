import React from 'react'
import { ExclamationIcon } from '@heroicons/react/solid'

export const WarningItem = (props: { message: string }) => {
  return (
    <div className="rounded-md bg-yellow-50 flex items-center pl-2 pr-2 pt-1 pb-1 ml-2">
      <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
      <p className="text-sm font-medium text-yellow-800 m-0 pl-1 pr-2">{props.message}</p>
    </div>
  )
}
