import React, { ComponentProps, FC } from 'react'
import { Alerte } from './Alerte'

type AlertBoxProps = ComponentProps<'div'> & { title?: string }

export const ErrorBox: FC<AlertBoxProps> = ({
  title,
  children,
  className = '',
  ...props
}: AlertBoxProps) => <Alerte {...{ ...props, type: 'Erreur', title, className, children }} />
