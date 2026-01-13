'use client';

import { SideMenu, SideMenuProps } from '@codegouvfr/react-dsfr/SideMenu';
import { usePathname } from 'next/navigation';

import { MenuToggle } from './MenuToggle';

type MenuProps = {
  items: SideMenuProps.Item[];
};

export const Menu = ({ items }: MenuProps) => {
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

const applyCurrentPath = (items: MenuProps['items'], currentPath: string): MenuProps['items'] =>
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
