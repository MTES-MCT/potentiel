import React, { useState } from 'react';
import { RiErrorWarningFill } from '@react-icons/all-files/ri/RiErrorWarningFill';

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
        className={`${className} bg-gray-100 border-x-0 border-t-0 border-b-2 border-solid outline-offset-4 outline-2 outline-solid outline-outline-base ${
          isOnError ? 'border-red-marianne-main-472-base' : 'border-gray-600'
        } rounded-none`}
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
          <RiErrorWarningFill className="text-sm text-red-marianne-main-472-base mr-2" />
          {error}
        </p>
      )}
    </>
  );
};
