import React, { ComponentProps, useState } from 'react';
import { ArrowDownIcon, ErrorIcon } from '@components';

type SelectProps = ComponentProps<'select'> & {
  name: string;
  id: string;
  error?: string;
  children: React.ReactNode;
};

export const Select = ({
  className = '',
  error = '',
  onChange,
  name,
  id,
  required,
  children,
  disabled,
  ...props
}: SelectProps) => {
  const [valueHasChanged, valueChanged] = useState(false);
  const isOnError = error !== '' && !valueHasChanged;
  return (
    <>
      <div className="relative">
        <ArrowDownIcon
          className={`absolute z-[1] right-2 pointer-events-none w-6 h-6 ${
            disabled ? 'text-gray-600' : 'text-black'
          } `}
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        />
        <select
          disabled={disabled}
          name={name}
          id={id}
          className={`w-full py-2 px-4 text-base appearance-none bg-gray-100 disabled:cursor-not-allowed disabled:text-grey-625-base hover:cursor-pointer focus:cursor-pointer outline-offset-2 outline-2 outline-outline-base border-x-0 border-t-0 border-b-2 border-solid ${
            isOnError ? 'border-red-marianne-main-472-base' : 'border-gray-600'
          } rounded-none rounded-t-[4px] ${className}`}
          required={required}
          onChange={(e) => {
            valueChanged(true);
            onChange && onChange(e);
          }}
          {...props}
        >
          {children}
        </select>
      </div>
      {isOnError && (
        <p
          aria-describedby={id}
          className="flex flex-row items-center m-0 mt-4 text-sm text-red-marianne-main-472-base"
        >
          <ErrorIcon className="text-sm text-red-marianne-main-472-base mr-2" />
          {error}
        </p>
      )}
    </>
  );
};
