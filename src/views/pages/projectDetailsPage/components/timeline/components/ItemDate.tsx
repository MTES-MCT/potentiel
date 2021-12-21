import React from 'react'
import { formatDate } from '../../../../../../helpers/formatDate'

export const ItemDate = (props: { date: number }) => (
  <span className="text-sm font-semibold tracking-wide uppercase">{formatDate(props.date)}</span>
)
