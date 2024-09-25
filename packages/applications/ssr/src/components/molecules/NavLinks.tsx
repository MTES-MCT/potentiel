'use client';
import { MainNavigation, MainNavigationProps } from '@codegouvfr/react-dsfr/MainNavigation';
import { usePathname } from 'next/navigation';

const mapToActiveLink = <TLink extends MainNavigationProps.Item>(
  item: TLink,
  pathname: string,
): TLink => {
  if (item.linkProps?.href.toString().split('?')[0] === pathname) {
    return {
      ...item,
      isActive: true,
    };
  }
  if ('menuLinks' in item && item.menuLinks) {
    const menuLinks = item.menuLinks.map((item) => mapToActiveLink(item, pathname));
    return {
      ...item,
      menuLinks,
      isActive: menuLinks.some((ml) => ml.isActive),
    };
  }

  return item;
};

export function NavLinks({ items }: MainNavigationProps) {
  const pathname = usePathname();

  return <MainNavigation items={items.map((item) => mapToActiveLink(item, pathname))} />;
}
