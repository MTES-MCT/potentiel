import React from 'react'

type AstérisqueProps = React.HTMLAttributes<HTMLSpanElement>

export const Astérisque = (props: AstérisqueProps) => (
  <span {...props} className={`text-red-500 ${props.className || ''}`}>
    *
  </span>
)
