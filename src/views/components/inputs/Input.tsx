import React, { ComponentProps, useState } from 'react'
import { RiErrorWarningFill } from '@react-icons/all-files/ri/RiErrorWarningFill'

type InputProps = ComponentProps<'input'> & {
  error?: string
}

export const Input = ({ className = '', error, onChange, ...props }: InputProps) => {
  const [valueHasChanged, valueChanged] = useState(false)
  const isOnError = error && !valueHasChanged

  return (
    <>
      <input
        {...props}
        className={`bg-grey-950-base border-x-0 border-t-0 border-b-2 border-solid ${
          isOnError ? 'border-red-marianne-main-472-base' : 'border-gray-600'
        } rounded-none disabled:cursor-not-allowed disabled:border-b-grey-925-base disabled:bg-grey-950-base  ${className}`}
        onChange={(e) => {
          valueChanged(true)
          onChange && onChange(e)
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
  )
}
