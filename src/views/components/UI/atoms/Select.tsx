import React, { ComponentProps } from 'react';

export type SelectProps = ComponentProps<'select'> & {
  options: [
    {
      value: string;
      default: true;
    },
    ...Array<{ value: string }>,
  ];
  name: string;
  id: string;
};

export const Select = ({ options, className = '', name, id, children, ...props }: SelectProps) => (
  <select
    className={`py-2 pl-4 bg-grey-950-base rounded-t-[4px] rounded-b-none border-0 border-solid border-b-grey-200-base border-b-2 ${className}`}
    id={id}
    name={name}
    {...props}
  >
    {options.map((option, index) => {
      if (index === 0) {
        return (
          <option selected disabled hidden>
            {option.value}
          </option>
        );
      }
      return <option>{option.value}</option>;
    })}
    {children}
  </select>
);
