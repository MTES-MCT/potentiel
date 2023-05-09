import React, { ComponentProps, ReactElement, useEffect, useRef, useState } from 'react';
import { ArrowDownIcon } from '../../atoms/icons';

type DropdownMenuProps = ComponentProps<'li'> & {
  buttonChildren: React.ReactNode;
  children?: (ReactElement | false)[];
};

export const DropdownMenu: React.FC<DropdownMenuProps> & { DropdownItem: typeof DropdownItem } = ({
  buttonChildren,
  children,
  className,
  ...props
}: DropdownMenuProps) => {
  const [visible, setVisible] = useState(false);
  const isCurrent = children
    ? children.some((subMenu) => subMenu && subMenu.props.isCurrent)
    : undefined;
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const onClickOut = (e: MouseEvent) => {
      const element = e.target as HTMLElement;
      if (ref.current !== element && !ref.current?.contains(element)) {
        setVisible(false);
      }
    };
    document.addEventListener('click', onClickOut);
    return () => document.removeEventListener('click', onClickOut);
  }, [setVisible]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setVisible(!visible);
    }
  };

  const menuRef = React.createRef<HTMLUListElement>();
  const handleKeyDownOnMenuList = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (
      event.key === 'Tab' &&
      (event.target as Element).nodeName === 'A' &&
      (event.target as Element).parentElement === menuRef.current?.lastChild
    ) {
      setVisible(false);
    }
  };

  return (
    <li
      ref={ref}
      className={`flex flex-col relative cursor-pointer ${className}`}
      aria-expanded={visible}
      {...props}
    >
      <div
        onClick={() => setVisible(!visible)}
        className={`flex items-center flex-1 py-2 lg:px-4 border-0 border-b lg:border-b-0 border-solid border-slate-200 lg:p-4 hover:bg-grey-1000-hover ${
          isCurrent && 'font-medium lg:border-l-0 lg:border-b-2 lg:border-b-blue-france-sun-base'
        }`}
      >
        {isCurrent && <div className="lg:hidden h-[24px] w-[2px] bg-blue-france-sun-base" />}
        <div
          className={`flex-1 no-underline pl-4 lg:pl-0 flex items-center`}
          tabIndex={0}
          aria-haspopup="true"
          onKeyDown={(event) => handleKeyDown(event)}
        >
          {buttonChildren}
          <ArrowDownIcon
            style={{ transform: visible ? 'rotate(180deg)' : '' }}
            className={`ml-auto lg:ml-2 mr-2 lg:mr-0 transition`}
            title={`${visible ? 'Fermer' : 'Ouvrir'} le sous-menu`}
          />
        </div>
      </div>
      <ul
        className={`list-none p-0 pl-4 lg:pl-0 lg:mt-4 z-10 lg:absolute top-full left-0 bg-white w-full lg:w-auto lg:shadow-[0_2px_6px_1px_rgba(0,0,0,0.2)] min-w-[300px] ${
          visible ? 'block' : 'hidden'
        }`}
        ref={menuRef}
        onKeyDown={(event) => handleKeyDownOnMenuList(event)}
      >
        {children}
      </ul>
    </li>
  );
};

type DropdownItemProps = {
  href: string;
  isCurrent?: true;
  children: React.ReactNode;
  download?: true;
  disabled?: true;
};

const DropdownItem = ({ children, href, isCurrent, download, disabled }: DropdownItemProps) => (
  <li
    style={{ borderBottomWidth: 1 }}
    className={`flex items-center hover:bg-grey-1000-hover border-0 border-b-1 last:border-b-0 border-grey-925-base border-solid ${
      isCurrent && ' font-medium'
    }`}
  >
    {isCurrent && <div className="h-[24px] w-[2px] bg-blue-france-sun-base" />}
    <a
      className="flex-1 px-4 py-3 block no-underline whitespace-nowrap"
      href={href}
      {...(download && { download: true })}
      {...(disabled && { disabled: true })}
      {...(isCurrent
        ? { 'aria-current': 'page', style: { color: '#000091' } }
        : { style: { color: 'black' } })}
    >
      {children}
    </a>
  </li>
);

DropdownMenu.DropdownItem = DropdownItem;
