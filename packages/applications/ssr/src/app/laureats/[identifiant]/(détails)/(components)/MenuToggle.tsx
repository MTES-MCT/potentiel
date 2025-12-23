'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import clsx from 'clsx';
import React, { useState } from 'react';

export const MenuToggle: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <>
      <Button
        iconId="fr-icon-arrow-left-s-line"
        onClick={() => setIsOpen(!isOpen)}
        priority="tertiary no outline"
        title={isOpen ? 'Cacher le menu' : 'Afficher le menu'}
        aria-label={isOpen ? 'Cacher le menu' : 'Afficher le menu'}
        className={clsx(
          'hidden md:block',
          'before:transition-transform',
          !isOpen && 'before:rotate-180',
        )}
      />
      <div
        className={clsx(
          'transition-all  mb-6',
          !isOpen ? '-translate-x-full absolute opacity-0' : ' ',
        )}
      >
        {children}
      </div>
    </>
  );
};
