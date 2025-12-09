'use client';

import { useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import { SideMenu } from '@codegouvfr/react-dsfr/SideMenu';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import {
  baseMenuItems,
  mapMenuItemsToSideMenuItems,
  MenuItem,
} from '../../_helpers/mapMenuItemsToSideMenuItems';

type Props = {
  baseURL: string;
  cahierDesCharges: PlainType<Lauréat.ConsulterCahierDesChargesReadModel>;
};

export const MenuLauréat = ({ baseURL, cahierDesCharges }: Props) => {
  const pathname = usePathname();
  const currentMenuId = pathname.split('/')[3] || '';
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // TODO: ajouter typologieInstallation
  const showInstallation = !!(
    cahierDesCharges.appelOffre.champsSupplémentaires?.autorisationDUrbanisme ||
    cahierDesCharges.appelOffre.champsSupplémentaires?.natureDeLExploitation ||
    cahierDesCharges.appelOffre.champsSupplémentaires?.installateur ||
    cahierDesCharges.appelOffre.champsSupplémentaires?.dispositifDeStockage
  );

  const filteredMenuItems = filterMenuItems({
    menu: baseMenuItems,
    filters: [{ label: 'Installation', show: showInstallation }],
  });

  const items = mapMenuItemsToSideMenuItems(filteredMenuItems, baseURL, currentMenuId);

  return (
    <div className="flex flex-col gap-0 top-0 bg-theme-white z-10 h-fit print:hidden">
      <Button
        iconId="fr-icon-menu-fill"
        onClick={() => setIsOpen(!isOpen)}
        priority="tertiary no outline"
        title="Fermer le menu"
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

type FilterMenuProps = {
  menu: MenuItem[];
  filters: Array<{
    label: string;
    show: boolean;
  }>;
};

const filterMenuItems = ({ menu, filters }: FilterMenuProps): MenuItem[] => {
  return menu
    .map((item) => {
      if (item.children) {
        return { ...item, children: filterMenuItems({ menu: item.children, filters }) };
      } else {
        const filter = filters.find((f) => f.label === item.label);
        if (filter) {
          return filter.show ? item : undefined;
        }
        return item;
      }
    })
    .filter((item): item is MenuItem => !!item);
};
