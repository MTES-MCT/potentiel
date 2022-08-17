import React, { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'

import { Link, Button } from '@components'

interface DropdownProps extends React.ComponentProps<'div'> {
  text: string
  design: 'link' | 'button'
  disabled?: boolean
}

export const Dropdown: React.FunctionComponent<DropdownProps> = ({
  text,
  children,
  className,
  design,
  disabled,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const button =
    design === 'link' ? (
      <Link onClick={() => setIsOpen(!isOpen)} disabled={disabled}>
        {text}{' '}
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 ml-1" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 ml-1" />
        )}
      </Link>
    ) : (
      <Button onClick={() => setIsOpen(!isOpen)} disabled={disabled}>
        {text}{' '}
        {disabled ? (
          <ChevronDownIcon className="w-5 h-5 ml-1" />
        ) : isOpen ? (
          <ChevronUpIcon className="w-5 h-5 ml-1" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 ml-1" />
        )}
      </Button>
    )
  return (
    <div className={`flex flex-col w-fit ${className || ''}`} {...props}>
      {button}
      <div className={isOpen && !disabled ? 'block' : 'hidden'}>{children}</div>
    </div>
  )
}
