import React from 'react';

import { Link, Button, ChevronDownIcon, ChevronUpIcon } from '@components';

interface DropdownProps extends React.ComponentProps<'div'> {
  text: string;
  design: 'link' | 'button';
  disabled?: boolean;
  isOpen?: boolean;
  changeOpenState: (isOpen: boolean) => void;
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
  const button =
    design === 'link' ? (
      <Link
        className="inline-flex justify-start items-center"
        onClick={() => changeOpenState(!isOpen)}
      >
        {text}{' '}
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 ml-1 -mb-1" title="Fermer le contenu" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 ml-1 -mb-1" title="Ouvrir le contenu" />
        )}
      </Link>
    ) : (
      <Button
        className="inline-flex justify-start items-center"
        onClick={() => changeOpenState(!isOpen)}
      >
        {text}{' '}
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 ml-1" title="Fermer le contenu" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 ml-1" title="Ouvrir le contenu" />
        )}
      </Button>
    );
  return (
    <div className={`flex flex-col w-fit ${className}`} {...props}>
      {button}
      <div className={isOpen && !disabled ? 'block' : 'hidden'}>{children}</div>
    </div>
  );
};
