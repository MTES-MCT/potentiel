import React, { ComponentProps } from 'react';

type LabelProps = ComponentProps<'label'> & {
  htmlFor: string;
  disabled?: true;
  optionnel?: true;
  reasonForOptionnel?: string;
};

export const Label = ({
  children,
  className = '',
  disabled = undefined,
  htmlFor,
  optionnel,
  reasonForOptionnel,
  ...props
}: LabelProps) => {
  const optionnelLabel = optionnel
    ? reasonForOptionnel
      ? ` (optionnel ${reasonForOptionnel})`
      : ' (optionnel)'
    : undefined;

  return (
    <label
      htmlFor={htmlFor}
      {...props}
      className={`${disabled && 'text-grey-625-base'} ${className}`}
    >
      {children}
      {optionnelLabel}
    </label>
  );
};
