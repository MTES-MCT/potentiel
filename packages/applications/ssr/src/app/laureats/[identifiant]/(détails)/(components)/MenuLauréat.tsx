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
  nombreTâches?: number;
};

export const MenuLauréat = ({ baseURL, cahierDesCharges, nombreTâches }: Props) => {
  const pathname = usePathname();
  const currentMenuId = pathname.split('/')[3] || '';
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const showInstallation = !!(
    cahierDesCharges.appelOffre.champsSupplémentaires?.autorisationDUrbanisme ||
    cahierDesCharges.appelOffre.champsSupplémentaires?.natureDeLExploitation ||
    cahierDesCharges.appelOffre.champsSupplémentaires?.installateur ||
    cahierDesCharges.appelOffre.champsSupplémentaires?.dispositifDeStockage ||
    cahierDesCharges.appelOffre.champsSupplémentaires?.typologieInstallation
  );

  const filteredMenuItems = filterMenuItems({
    menu: baseMenuItems,
    filters: [
      { label: 'Installation', show: showInstallation },
      { label: 'Tâches', show: nombreTâches !== undefined },
    ],
  });

  const items = mapMenuItemsToSideMenuItems(
    filteredMenuItems,
    baseURL,
    currentMenuId,
    nombreTâches,
  );

  return (
    <div className="flex flex-col gap-0 top-0 bg-theme-white z-10 h-fit print:hidden min-w-16 ">
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
      <div className="relative">
        <SideMenu
          align="left"
          sticky
          className={clsx(
            'transition-all  mb-6',
            !isOpen ? '-translate-x-full absolute opacity-0' : ' ',
          )}
          burgerMenuButtonText="Menu"
          items={items}
        />
      </div>
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
