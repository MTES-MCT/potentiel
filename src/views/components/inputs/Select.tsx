import { RiErrorWarningFill } from '@react-icons/all-files/ri/RiErrorWarningFill'
import React, { useState } from 'react'

type SelectProps = React.HTMLAttributes<HTMLSelectElement> & {
  name?: string
  id: string
  required?: true
  error?: string
  children: React.ReactNode
}

export const Select = ({
  className = '',
  error = '',
  onChange,
  name,
  id,
  required,
  children,
}: SelectProps) => {
  const [valueHasChanged, valueChanged] = useState(false)
  const isOnError = error !== '' && !valueHasChanged
  return (
    <>
      <select
        name={name}
        id={id}
        className={`${className} w-full bg-gray-100 border-x-0 border-t-0 border-b-2 border-solid ${
          isOnError ? 'border-red-marianne-main-472-base' : 'border-gray-600'
        } rounded-none`}
        required={required}
        onChange={(e) => {
          valueChanged(true)
          onChange && onChange(e)
        }}
      >
        {children}
      </select>
      {isOnError && (
        <p
          aria-describedby={id}
          className="flex flex-row items-center m-0 mt-0.5 text-sm text-red-marianne-main-472-base"
        >
          <RiErrorWarningFill className="text-sm text-red-marianne-main-472-base mr-2" />
          {error}
        </p>
      )}
    </>
  )
}
