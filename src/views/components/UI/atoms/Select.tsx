import React, { ComponentProps, useState } from 'react';
import { ArrowDownIcon, ErrorIcon } from "../..";

type SelectProps = ComponentProps<'select'> & {
  error?: string;
};

export const Select = ({
  className = '',
  error = '',
  onChange,
  children,
  ...props
}: SelectProps) => {
  const { id, disabled } = props;

  const [valueHasChanged, valueChanged] = useState(false);
  const isOnError = error !== '' && !valueHasChanged;

  return (
    <>
      <div className={`relative ${className}`}>
        <ArrowDownIcon
          aria-hidden
          className={`absolute z-[1] right-2 pointer-events-none w-6 h-6 ${
            disabled ? 'text-grey-625-base' : 'text-black'
          } `}
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        />
        <select
          {...props}
          className={`w-full mt-2 py-2 pr-8 px-4 text-base appearance-none bg-gray-100 hover:cursor-pointer focus:cursor-pointer outline-offset-4 outline-2 outline-solid outline-outline-base border-x-0 border-t-0 border-b-2 border-solid ${
            isOnError ? 'border-red-marianne-main-472-base' : 'border-gray-600'
          } rounded-none rounded-t-[4px] disabled:cursor-not-allowed disabled:border-b-grey-925-base disabled:text-grey-625-base`}
          onChange={(e) => {
            valueChanged(true);
            onChange && onChange(e);
          }}
        >
          {children}
        </select>
      </div>
      {isOnError && (
        <p
          aria-describedby={id}
          className="flex flex-row items-center m-0 mt-4 text-sm text-red-marianne-main-472-base"
        >
          <ErrorIcon className="text-sm text-red-marianne-main-472-base mr-2" aria-hidden />
          {error}
        </p>
      )}
    </>
  );
};
