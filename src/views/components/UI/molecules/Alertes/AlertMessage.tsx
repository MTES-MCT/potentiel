import React, { ComponentProps } from 'react';
import { ErrorIcon } from '../../atoms';

type AlertMessageProps = ComponentProps<'div'> & { message: string };

export const AlertMessage = ({ message, className = '', ...props }: AlertMessageProps) => {
  return (
    <div
      {...props}
      className={`flex flex-row mt-0 mb-3 text-sm text-red-marianne-main-472-base ${className}`}
    >
      <div>
        <ErrorIcon className="text-lg text-red-marianne-main-472-base mr-2" aria-hidden />
      </div>
      <p className="m-0">{message}</p>
    </div>
  );
};
