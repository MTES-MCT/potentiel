import React, { ComponentProps, useLayoutEffect, useRef, useState } from 'react'
import { ArrowDownIcon } from '../atoms/icons'

type DropdownMenuProps = ComponentProps<'li'> & {
  buttonChildren: React.ReactNode
  children: React.ReactNode
}

const DropdownMenu: React.FC<DropdownMenuProps> & { DropdownItem: typeof DropdownItem } = ({
  buttonChildren,
  children,
  className,
  ...props
}: DropdownMenuProps) => {
  const [visible, setVisible] = useState(false)

  const ref = useRef<HTMLLIElement>(null)
  useLayoutEffect(() => {
    const onClick = (e: MouseEvent) => {
      const element = e.target as HTMLElement
      if (ref.current !== element && !ref.current?.contains(element)) {
        setVisible(false)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  })

  return (
    <li
      ref={ref}
      className={`flex flex-col relative cursor-pointer ${className}`}
      aria-expanded={visible}
      {...props}
    >
      <div
        onClick={() => setVisible(!visible)}
        className={`py-2 lg:px-4 border-0 border-b lg:border-b-0 border-solid border-slate-200 lg:p-4 hover:bg-grey-1000-hover`}
      >
        <div className={`no-underline pl-4 lg:pl-0 flex items-center`}>
          {buttonChildren}
          <ArrowDownIcon
            className={`ml-auto md:ml-2 mr-2 transition transition-rotate ${
              visible ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>
      <ul
        className={`list-none p-0 px-4 md:px-0 md:mt-4 z-10 md:absolute top-full left-0 bg-white w-full md:w-auto md:shadow-[0_2px_6px_1px_rgba(0,0,0,0.2)] min-w-[300px] ${
          visible ? 'block' : 'hidden'
        }`}
      >
        {children}
      </ul>
    </li>
  )
}

type DropdownItemProps = {
  href: string
  isCurrent?: true
  children: React.ReactNode
}

const DropdownItem = ({ children, href, isCurrent }: DropdownItemProps) => (
  <li
    style={{ borderBottomWidth: 1 }}
    className={`flex items-center border-0 border-b-1 last:border-b-0 border-grey-925-base border-solid ${
      isCurrent && ' font-medium'
    }`}
  >
    {isCurrent && <div className="h-[24px] w-[2px] bg-blue-france-sun-base" />}
    <a
      className="px-4 py-3 block no-underline hover:bg-grey-1000-hover whitespace-nowrap"
      href={href}
      {...(isCurrent
        ? { 'aria-current': 'page', style: { color: '#000091' } }
        : { style: { color: 'black' } })}
    >
      {children}
    </a>
  </li>
)

DropdownMenu.DropdownItem = DropdownItem

export { DropdownMenu }
