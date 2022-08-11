import React from 'react'

type AstérisqueProps = React.HTMLAttributes<HTMLSpanElement>

export const Astérisque = (props: AstérisqueProps) => (
  <span className="text-red-500" {...props}>
    *
  </span>
)
