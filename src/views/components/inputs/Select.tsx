import React from 'react'

type SelectProps = React.HTMLAttributes<HTMLInputElement> & {
  options: string[]
  name?: string
  id: string
  required?: true
  error?: string
}

export const Select = ({ name, id, required, options }: SelectProps) => {
  return (
    <select
      name={name}
      id={id}
      className="w-full bg-gray-100 border-x-0 border-t-0 border-b-2 border-solid border-gray-600 rounded-none"
      required={required}
    >
      {options
        .sort((a, b) => a.localeCompare(b))
        .map((value, index) => (
          <option key={name + '_' + index} value={value}>
            {value}
          </option>
        ))}
    </select>
  )
}
