'use client';

import { useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import { SideMenu } from '@codegouvfr/react-dsfr/SideMenu';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { mapMenuItemsToSideMenuItems, menuItems } from '../../_helpers/mapMenuItemsToSideMenuItems';

type Props = {
  baseURL: string;
  cahierDesCharges: PlainType<Lauréat.ConsulterCahierDesChargesReadModel>;
};

export const MenuLauréat = ({ baseURL, cahierDesCharges }: Props) => {
  const pathname = usePathname();
  const currentMenuId = pathname.split('/')[3] || '';
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // Exemple de filtrage basé sur le cahier des charges
  const filteredMenuItems = menuItems.filter((item) => {
    if (item.label === 'Informations Générales') {
      return cahierDesCharges.appelOffre.champsSupplémentaires?.installateur;
    }
    return true;
  });

  const items = mapMenuItemsToSideMenuItems(filteredMenuItems, baseURL, currentMenuId);

  return (
    <div className="flex flex-col gap-0 top-0 bg-theme-white z-10 h-fit print:hidden">
      <Button
        iconId="fr-icon-menu-fill"
        onClick={() => setIsOpen(!isOpen)}
        priority="tertiary no outline"
        title="Fermer le menu"
        size="small"
      />
      <SideMenu
        align="left"
        sticky
        className={clsx(!isOpen ? 'hidden' : 'w-64')}
        burgerMenuButtonText="Menu"
        items={items}
      />
    </div>
  );
};
