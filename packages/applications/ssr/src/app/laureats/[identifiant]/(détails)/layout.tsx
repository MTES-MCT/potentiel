'use client';
import { SideMenu } from '@codegouvfr/react-dsfr/SideMenu';
import { usePathname } from 'next/navigation';

import { decodeParameter } from '@/utils/decodeParameter';

import { mapMenuItemsToSideMenuItems, menuItems } from '../_helpers/mapMenuItemsToSideMenuItems';

type LayoutProps = {
  children: React.ReactNode;
  params: { identifiant: string };
};

export default function LauréatDétailsLayout({ children, params: { identifiant } }: LayoutProps) {
  const identifiantProjet = decodeParameter(identifiant);
  const pathname = usePathname();

  // à voir pour cette fonction
  const getTabIdFromPath = () => {
    const pathParts = pathname.split('/');
    return pathParts.length > 3 ? pathParts[3] : '';
  };

  const selectedTabId = getTabIdFromPath();

  const baseURL = `/laureats/${encodeURIComponent(identifiantProjet)}`;

  return (
    <div className="flex flex-col gap-2 fr-container">
      <div className="flex flex-row">
        <SideMenu
          align="left"
          className="w-64 sticky ml-0 pt-4 top-0 bg-theme-white z-10 h-fit"
          burgerMenuButtonText="Menu"
          items={mapMenuItemsToSideMenuItems(menuItems, baseURL, selectedTabId)}
          title="Votre projet"
        />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
