'use client';

import { SideMenu } from '@codegouvfr/react-dsfr/SideMenu';
import { usePathname } from 'next/navigation';

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

  // Exemple de filtrage basé sur le cahier des charges
  const filteredMenuItems = menuItems.filter((item) => {
    if (item.label === 'Informations Générales') {
      return cahierDesCharges.appelOffre.champsSupplémentaires?.installateur;
    }
    return true;
  });

  const items = mapMenuItemsToSideMenuItems(filteredMenuItems, baseURL, currentMenuId);

  return (
    <SideMenu
      align="left"
      sticky
      className="w-64 pt-4 top-0 bg-theme-white z-10 h-fit"
      burgerMenuButtonText="Menu"
      items={items}
      title="Votre projet"
    />
  );
};
