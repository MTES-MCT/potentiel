'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import clsx from 'clsx';
import type React from 'react';
import { useState } from 'react';

export const MenuToggle: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const label = isOpen ? 'Cacher le menu' : 'Afficher le menu';

  return (
    <>
      <Button
        iconId="fr-icon-arrow-left-s-line"
        onClick={() => setIsOpen(!isOpen)}
        priority="tertiary no outline"
        title={label}
        aria-label={label}
        className="hidden md:block"
      />
      <div className={clsx('  mb-6', !isOpen ? '-translate-x-full absolute opacity-0' : ' ')}>
        {children}
      </div>
    </>
  );
};
