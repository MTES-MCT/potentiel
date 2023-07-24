import React, { ComponentProps, useState } from 'react';
import { ErrorIcon } from './icons';

type InputProps = ComponentProps<'input'> & {
  error?: string;
};

export const Input = ({ className = '', error = '', onChange, ...props }: InputProps) => {
  const [valueHasChanged, valueChanged] = useState(false);
  const isOnError = error !== '' && !valueHasChanged;

  return (
    <>
      <input
        {...props}
        className={`appearance-none w-full py-2 px-3 box-border rounded-[3px] text-base bg-grey-950-base border-0 border-b-2 border-solid font-body ${
          isOnError ? 'border-red-marianne-main-472-base' : 'border-gray-600'
        } outline-offset-4 outline-2 outline-solid outline-outline-base rounded-none disabled:cursor-not-allowed disabled:border-b-grey-925-base disabled:bg-grey-950-base ${className}`}
        onChange={(e) => {
          valueChanged(true);
          onChange && onChange(e);
        }}
      />
      {isOnError && (
        <p
          aria-describedby={props.id}
          className="flex flex-row items-center m-0 mt-0.5 text-sm text-red-marianne-main-472-base"
        >
          <ErrorIcon className="text-sm text-red-marianne-main-472-base mr-2" />
          {error}
        </p>
      )}
    </>
  );
};
