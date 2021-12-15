import React from 'react'

export const ContentArea = (props: { children: any }) => {
  return <div className="ml-4 min-w-0 flex flex-col">{props.children}</div>
}
