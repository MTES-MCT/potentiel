import React, { ComponentProps, FC } from 'react';
import { Label } from './Label';
import { CheckIcon } from './icons';

type RichCheckboxProps = Omit<ComponentProps<'input'>, 'type'> & { id: string };

export const RichCheckbox: FC<RichCheckboxProps> = ({ className = '', children, ...props }) => (
  <>
    <input type="checkbox" className={`hidden peer`} {...props} />
    <Label
      htmlFor={props.id}
      className={`flex
                  items-center
                  relative
                  hover:cursor-pointer 
                  before:content-['']
                  before:checked:transition-all
                  before:appearance-none
                  before:block
                  before:w-6
                  before:h-6
                  before:my-auto
                  before:mr-2
                  before:flex-none
                  before:border
                  before:border-solid
                  before:border-black
                  before:rounded-[3px]
                  peer-checked:before:opacity-100
                  peer-checked:before:bg-blue-france-sun-base
                  peer-disabled:before:bg-neutral-200 
                  disabled:border-grey-625-base
                  peer-disabled:cursor-not-allowed 
                  peer-disabled:text-grey-625-base
                  peer-disabled:peer-checked:before:bg-grey-625-base
                  peer-disabled:before:border-grey-625-base
                  outline-offset-4 outline-2 outline-solid outline-outline-base 
                  group
                  ${className}`}
    >
      <CheckIcon className="text-xxs text-white opacity-0 absolute w-6 h-6 text-center peer-checked:group-[]:opacity-100 ml-[1px]" />
      {children}
    </Label>
  </>
);
