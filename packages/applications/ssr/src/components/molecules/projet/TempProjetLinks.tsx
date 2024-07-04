import Button from '@codegouvfr/react-dsfr/Button';
import { Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';

type FuncKeys<T> = {
  [K in keyof T]: T[K] extends (id: string) => string ? K : never;
}[keyof T];

type ProjetLinksProps<T extends keyof typeof Routes> = {
  identifiantProjet: string;
  title: T;
  links: FuncKeys<(typeof Routes)[T]>[];
};

/** @deprecated Temporary until Projet is migrated */
export const ProjetLinks = <T extends keyof typeof Routes>({
  title,
  links,
  identifiantProjet,
}: ProjetLinksProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button onClick={handleClick}>{title}</Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {links.map((text) => (
          <Link href={(Routes[title][text] as any)(identifiantProjet)}>
            <MenuItem onClick={handleClose}>{text as string}</MenuItem>
          </Link>
        ))}
      </Menu>
    </div>
  );
};
