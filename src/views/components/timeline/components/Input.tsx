import React from 'react'

type InputProps = {
  label: string
  type: 'text' | 'email' | 'date'
  name: string
  required?: true
  className?: string
}

export const Input = ({ label, type, name, required, className = '' }: InputProps) => {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        {...(required && { required: true })}
        className={`${className}bg-gray-100 border-x-0 border-t-0 border-b-2 border-solid border-gray-600 rounded-none`}
      />
    </>
  )
}
