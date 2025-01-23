import React, { ComponentProps, FC, useEffect } from 'react';
import { Alerte } from './Alerte';

type AlertBoxProps = ComponentProps<'div'> & { title?: string };

export const SuccessBox: FC<AlertBoxProps> = ({
  title,
  children,
  className = '',
  ...props
}: AlertBoxProps) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, []);

  return <Alerte {...{ ...props, type: 'Succès', title, className, children }} />;
};
