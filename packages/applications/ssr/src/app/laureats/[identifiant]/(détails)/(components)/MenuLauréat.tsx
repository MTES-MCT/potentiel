'use client';
import { SideMenu, SideMenuProps } from '@codegouvfr/react-dsfr/SideMenu';
import { usePathname } from 'next/navigation';

import { MenuToggle } from './MenuToggle';

type MenuLauréatProps = {
  items: SideMenuProps.Item[];
};

export const MenuLauréat = ({ items }: MenuLauréatProps) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-0 top-0 bg-theme-white z-10 h-fit print:hidden min-w-16 ">
      <div className="relative">
        <MenuToggle>
          <SideMenu
            align="left"
            sticky
            burgerMenuButtonText="Menu"
            items={applyCurrentPath(items, pathname)}
          />
        </MenuToggle>
      </div>
    </div>
  );
};

const applyCurrentPath = (
  items: MenuLauréatProps['items'],
  currentPath: string,
): MenuLauréatProps['items'] =>
  items.map((item) => {
    if ('items' in item) {
      const items = applyCurrentPath(item.items, currentPath);
      return {
        ...item,
        expandedByDefault: items.some((item) => item.isActive),
        items,
      };
    }
    return {
      ...item,
      isActive:
        trimTrailingSlash(item.linkProps.href.toString()) === trimTrailingSlash(currentPath),
    };
  });

const trimTrailingSlash = (url: string) => (url.endsWith('/') ? url.slice(0, -1) : url);
