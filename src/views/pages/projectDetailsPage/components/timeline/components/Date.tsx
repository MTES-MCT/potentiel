import React from 'react'
import { formatDate } from '../../../../../../helpers/formatDate'

export const Date = (props: { date: number }) => (
  <span className="text-sm font-semibold tracking-wide uppercase">{formatDate(props.date)}</span>
)
