import React from 'react'

export const InfoItem = (props: { message: string }) => {
  return (
    <div className="rounded-md bg-blue-700 flex items-center px-2 py-0.5 ml-2">
      <p className="text-sm font-bold tracking-wide uppercase text-white m-0">{props.message}</p>
    </div>
  )
}
