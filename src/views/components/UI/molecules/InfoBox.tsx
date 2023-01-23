import React, { ComponentProps } from 'react'
import { Alerte } from './Alerte'

export type InfoBoxProps = ComponentProps<'div'> & { title?: string }

export const InfoBox = ({ title, children, className = '', ...props }: InfoBoxProps) => (
  <Alerte {...{ ...props, type: 'Information', title, className, children }} />
)
