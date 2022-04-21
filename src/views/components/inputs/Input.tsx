import React from 'react'
import { RiErrorWarningFill } from '@react-icons/all-files/ri/RiErrorWarningFill'

type InputProps = {
  type?: 'text' | 'email' | 'date'
  id?: string
  name?: string
  placeholder?: string
  required?: true
  className?: string
  pattern?: string
  error?: string
}

export const Input = ({
  type,
  id,
  name,
  placeholder,
  required,
  className = '',
  error,
  pattern,
}: InputProps) => {
  return (
    <>
      <input
        {...{ type, id, name, placeholder, required, pattern }}
        className={`${className} bg-gray-100 border-x-0 border-t-0 border-b-2 border-solid ${
          error ? 'border-red-marianne-main-472-base' : 'border-gray-600'
        } rounded-none`}
      />
      {error && (
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
