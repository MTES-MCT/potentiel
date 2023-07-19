import React, { useState } from 'react';
import { ErrorIcon } from '../UI/atoms';

type TextAreaProps = React.HTMLAttributes<HTMLTextAreaElement> & {
  value?: string;
  name?: string;
  placeholder?: string;
  required?: true;
  pattern?: string;
  error?: string;
  max?: string;
  disabled?: true;
};

export const TextArea = ({ className = '', error = '', onChange, ...props }: TextAreaProps) => {
  const [valueHasChanged, valueChanged] = useState(false);
  const isOnError = error !== '' && !valueHasChanged;

  return (
    <>
      <textarea
        {...props}
        className={`
        w-full py-2 px-3 rounded-[3px] text-base bg-gray-100 box-border border-x-0 border-t-0 border-b-2 border-solid 
        outline-offset-4 outline-2 outline-solid outline-outline-base 
        disabled:cursor-not-allowed disabled:border-b-grey-925-base disabled:bg-grey-950-base 
        ${isOnError ? 'border-red-marianne-main-472-base' : 'border-gray-600'} ${className}`}
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
