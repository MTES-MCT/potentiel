import React, { ComponentProps, ReactNode, useRef, useState } from 'react';
import { AddIcon, SubtractIcon } from '../atoms/icons';

type AccordeonProps = ComponentProps<'div'> & {
  buttonChildren: React.ReactNode;
  children: ReactNode;
};

export const Accordeon: React.FC<AccordeonProps> = ({
  buttonChildren,
  children,
  className,
  ...props
}: AccordeonProps) => {
  const [visible, setVisible] = useState(true);

  const ref = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setVisible(!visible);
    }
  };

  return (
    <div
      ref={ref}
      className={`flex flex-col relative cursor-pointer border-solid border-x-0 border-y-[1px] border-y-grey-900-base bg-white  ${className}`}
      aria-expanded={visible}
      {...props}
    >
      <div
        className={`flex justify-between items-center px-4 py-3 text-base text-decoration-none font-medium hover:bg-grey-1000-hover focus:bg-grey-1000-hover`}
        onClick={() => setVisible(!visible)}
        onKeyDown={(event) => handleKeyDown(event)}
        tabIndex={0}
        aria-haspopup="true"
      >
        {buttonChildren}
        {visible ? (
          <SubtractIcon className={`ml-auto lg:ml-2 mr-2 z-0`} title="Fermer" />
        ) : (
          <AddIcon className="ml-auto lg:ml-2 mr-2 z-0" title="Ouvrir" />
        )}
      </div>
      {visible && <div className="px-4 pt-4 pb-6">{children}</div>}
    </div>
  );
};
