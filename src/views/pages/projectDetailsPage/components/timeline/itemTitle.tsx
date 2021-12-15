import React from 'react'

export const ItemTitle = (props: { title: string }) => {
  return <span className="text-sm font-semibold tracking-wide uppercase">{props.title}</span>
}
