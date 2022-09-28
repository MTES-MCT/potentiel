import React, { ComponentProps } from 'react'

type RichRadioProps = Omit<ComponentProps<'input'>, 'type'> & { id: string }

export const RichRadio: React.FC<RichRadioProps> = ({ children, className = '', ...props }) => (
  <div>
    <input
      type="radio"
      className="hidden peer"
      style={{ display: 'none' }}
      {...{
        ...props,
      }}
    />
    <label
      htmlFor={props.id}
      className={`flex py-6 border border-grey-925-base border-solid 
                peer-checked:border-blue-france-sun-base 
                  hover:cursor-pointer 
                  peer-disabled:cursor-not-allowed peer-disabled:text-grey-625-base
                  before:content-['']
                  before:inline-block
                  before:flex-shrink-0
                  before:w-4
                  before:h-4
                  before:m-5
                  before:my-auto
                  before:rounded-full
                  before:border
                  before:border-solid
                  before:border-grey-50-base
                  peer-checked:before:bg-blue-france-sun-base 
                  peer-checked:before:shadow-[inset_0_0_0_3px_rgb(255,255,255,1)]
                  peer-disabled:before:border-grey-625-base
                  peer-disabled:peer-checked:before:bg-grey-625-base 
                  ${className}`}
    >
      {children}
    </label>
  </div>
)
