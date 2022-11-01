import React from 'react'

import { Link, Button, ChevronDownIcon, ChevronUpIcon } from '@components'

interface DropdownProps extends React.ComponentProps<'div'> {
  text: string
  design: 'link' | 'button'
  disabled?: boolean
  isOpen?: boolean
  changeOpenState: (isOpen: boolean) => void
}

export const Dropdown: React.FunctionComponent<DropdownProps> = ({
  text,
  children,
  className = '',
  design,
  disabled,
  isOpen = false,
  changeOpenState,
  ...props
}) => {
  // const [show = isOpen, changeShowState] = useState(false)

  const button =
    design === 'link' ? (
      <Link
        className="inline-flex justify-start items-center"
        onClick={() => changeOpenState(!isOpen)}
      >
        {text}{' '}
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 ml-1 -mb-1" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 ml-1 -mb-1" />
        )}
      </Link>
    ) : (
      <Button
        className="inline-flex justify-start items-center"
        onClick={() => changeOpenState(!isOpen)}
      >
        {text}{' '}
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 ml-1" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 ml-1" />
        )}
      </Button>
    )
  return (
    <div className={`flex flex-col w-fit${className}`} {...props}>
      {button}
      <div className={isOpen && !disabled ? 'block' : 'hidden'}>{children}</div>
    </div>
  )
}
