import React, { ComponentProps } from 'react'

type RichRadioProps = Exclude<ComponentProps<'input'>, 'type'> & { id: string }

export const RichRadio: React.FC<RichRadioProps> = ({ children, className = '', ...props }) => (
  <div className={`${className} relative`}>
    <input
      type="radio"
      className="absolute left-3 top-1/2 peer"
      {...{
        ...props,
      }}
    />
    <label
      htmlFor={props.id}
      className={`flex-1 flex-row pl-10 border border-grey-925-base border-solid py-6 peer-checked:border-blue-france-sun-base hover:cursor-pointer peer-disabled:cursor-not-allowed
                  ${props.disabled && 'text-grey-625-base'}`}
    >
      {children}
    </label>
  </div>
)
