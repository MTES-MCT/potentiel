import React, { ComponentProps, ReactElement, useEffect, useRef, useState } from 'react';
import { Link } from '../../atoms';
import { ArrowDownIcon } from '../../atoms/icons';

type DropdownSecondaryProps = ComponentProps<'div'> & {
  titre: string;
  children: (ReactElement | false)[];
};

export const DropdownSecondary: React.FC<DropdownSecondaryProps> & {
  DropdownItem: typeof DropdownItem;
} = ({ titre, children, className, ...props }: DropdownSecondaryProps) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={ref}
      className={`flex flex-col relative cursor-pointer  border border-solid outline-offset-4 outline-2 outline-solid outline-outline-base border-blue-france-sun-base text-blue-france-sun-base bg-white hover:bg-blue-france-975-base focus:bg-blue-france-975-base ${className}`}
      aria-expanded={visible}
      {...props}
    >
      <div
        onClick={() => setVisible(!visible)}
        className={`px-6 py-2 flex items-center flex-1 no-underline `}
      >
        <span className="whitespace-nowrap"> {titre}</span>
        <ArrowDownIcon
          style={{ transform: visible ? 'rotate(180deg)' : '' }}
          className={`ml-auto lg:ml-2 mr-2 lg:mr-0 transition`}
          title={`${visible ? 'Fermer' : 'Ouvrir'} le sous-menu`}
        />
      </div>
      <ul
        className={`bg-white list-none p-0 mt-4 z-10 absolute top-full left-0 shadow-[0_2px_6px_1px_rgba(0,0,0,0.2)] min-w-[300px] ${
          visible ? 'block' : 'hidden'
        }`}
      >
        {children}
      </ul>
    </div>
  );
};

type DropdownItemProps = {
  href: string;
  isCurrent?: true;
  children: React.ReactNode;
  download?: true;
  disabled?: true;
};

const DropdownItem = ({ children, href, download, disabled }: DropdownItemProps) => (
  <li
    style={{ borderBottomWidth: 1 }}
    className={`bg-white flex items-center hover:bg-grey-1000-hover border-0 border-b-1 last:border-b-0 border-grey-925-base border-solid`}
  >
    <Link
      className="flex-1 px-4 py-3 block no-underline whitespace-nowrap"
      href={href}
      {...(download && { download: true })}
      {...(disabled && { disabled: true })}
    >
      {children}
    </Link>
  </li>
);

DropdownSecondary.DropdownItem = DropdownItem;
