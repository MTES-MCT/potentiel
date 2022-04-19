import React from 'react'

type EmailInputProps = {
  id?: string
  name?: string
  required?: true
  className?: string
}

export const EmailInput = ({ id, name, required, className = '' }: EmailInputProps) => {
  return (
    <input
      type="email"
      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
      {...{ id, name, required }}
      className={`${className} bg-gray-100 border-x-0 border-t-0 border-b-2 border-solid border-gray-600 rounded-none`}
    />
  )
}
