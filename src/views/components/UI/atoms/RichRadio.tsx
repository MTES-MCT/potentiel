import React, { ComponentProps } from 'react'

type RichRadioProps = Omit<ComponentProps<'input'>, 'type'> & { id: string }

export const RichRadio: React.FC<RichRadioProps> = ({ children, className = '', ...props }) => (
  <div className="relative">
    <input
      type="radio"
      className="absolute left-3 top-1/2 peer"
      {...{
        ...props,
      }}
    />
    <label
      htmlFor={props.id}
      className={`flex pl-10 py-6 border border-grey-925-base border-solid peer-checked:border-blue-france-sun-base hover:cursor-pointer peer-disabled:cursor-not-allowed
                  ${props.disabled && 'text-grey-625-base'} ${className}`}
    >
      {children}
    </label>
  </div>
)
