import React, { ComponentProps } from 'react';
import { Label } from '../atoms/Label';

type RadioProps = Omit<ComponentProps<'input'>, 'type'> & { id: string };

export const Radio: React.FC<RadioProps> = ({ children, className = '', ...props }) => (
  <>
    <input
      type="radio"
      className="hidden peer"
      {...{
        ...props,
      }}
    />
    <Label
      htmlFor={props.id}
      className={`flex
                  hover:cursor-pointer 
                  before:content-['']
                  before:inline-block
                  before:flex-shrink-0
                  before:w-4
                  before:h-4
                  before:mr-5
                  before:my-auto
                  before:rounded-full
                  before:border
                  before:border-solid
                  before:border-grey-50-base
                  peer-checked:before:bg-blue-france-sun-base 
                  peer-checked:before:shadow-[inset_0_0_0_3px_rgb(255,255,255,1)]
                  peer-disabled:cursor-not-allowed 
                  peer-disabled:text-grey-625-base
                  peer-disabled:peer-checked:before:bg-grey-625-base
                  ${className}`}
    >
      {children}
    </Label>
  </>
);
