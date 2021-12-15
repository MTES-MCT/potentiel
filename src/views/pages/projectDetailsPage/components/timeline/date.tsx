import React from 'react'
import { formatDate } from '../../../../../helpers/formatDate'
import { ProjectEventDTO } from '../../../../../modules/frise/dtos/ProjectEventListDTO'

export const Date = (props: { date: number }) => {
  return (
    <span className="text-sm font-semibold tracking-wide uppercase">{formatDate(props.date)}</span>
  )
}
