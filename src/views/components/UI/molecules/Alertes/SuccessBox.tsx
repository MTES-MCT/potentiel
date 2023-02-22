import React, { ComponentProps, FC } from 'react';
import { Alerte } from './Alerte';

type AlertBoxProps = ComponentProps<'div'> & { title?: string };

export const SuccessBox: FC<AlertBoxProps> = ({
  title,
  children,
  className = '',
  ...props
}: AlertBoxProps) => <Alerte {...{ ...props, type: 'Succès', title, className, children }} />;
