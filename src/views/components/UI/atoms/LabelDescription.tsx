import React, { ComponentProps } from 'react';

type LabelDescriptionProps = ComponentProps<'div'>;

export const LabelDescription = ({ children, className = '' }: LabelDescriptionProps) => (
  <div className={`m-0 mt-1 text-xs ${className}`}>{children}</div>
);
