import React, { ComponentProps, FC } from 'react'
import { Alerte } from './Alerte'

type AlertBoxProps = ComponentProps<'div'> & { title?: string }

export const AlertBox: FC<AlertBoxProps> = ({
  title,
  children,
  className = '',
  ...props
}: AlertBoxProps) => <Alerte {...{ ...props, type: 'Attention', title, className, children }} />
