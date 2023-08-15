import React from 'react';

import { Link, PrimaryButton, ChevronDownIcon, ChevronUpIcon } from "..";

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
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      !isOpen && changeOpenState(!isOpen);
    }
  };
  const button =
    design === 'link' ? (
      <Link
        className="inline-flex justify-start items-center cursor-pointer"
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
      <PrimaryButton
        className="inline-flex justify-start items-center"
        onClick={() => changeOpenState(!isOpen)}
        onKeyDown={(event) => handleKeyDown(event)}
      >
        {text}{' '}
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 ml-1" title="Fermer le contenu" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 ml-1" title="Ouvrir le contenu" />
        )}
      </PrimaryButton>
    );
  return (
    <div
      tabIndex={0}
      aria-haspopup="true"
      onKeyDown={(event) => handleKeyDown(event)}
      className={`flex flex-col w-fit ${className}`}
      {...props}
    >
      {button}
      <div className={isOpen && !disabled ? 'block' : 'hidden'}>{children}</div>
    </div>
  );
};
