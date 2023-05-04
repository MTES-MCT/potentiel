import React, { ComponentProps, FC } from 'react';

type InputCheckboxProps = ComponentProps<'input'>;

export const InputCheckbox: FC<InputCheckboxProps> = ({ className = '', ...props }) => (
  <input
    type="checkbox"
    className={`
        appearance-none w-6 h-6 border-[1px] border-solid mr-2 relative border-black bg-transparent focus:border-black rounded-[3px]
        checked:bg-blue-france-sun-base checked:opacity-1 checked:transition-all disabled:bg-neutral-200 disabled:border-grey-625-base 
        cursor-pointer outline-offset-4 outline-2 outline-solid outline-outline-base ${className}`}
    {...props}
  />
);
