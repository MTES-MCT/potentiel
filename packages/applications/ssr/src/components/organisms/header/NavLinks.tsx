'use client';
import { MainNavigation, type MainNavigationProps } from '@codegouvfr/react-dsfr/MainNavigation';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

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
  const ref = useRef<string>(undefined);

  // Reset focus on navigation, to improve keyboard navigation
  useEffect(() => {
    if (ref) {
      document.documentElement.focus({ preventScroll: true });
    }
    ref.current = pathname;
  }, [pathname]);

  return (
    <MainNavigation
      id="main-navigation"
      items={items.map((item) => mapToActiveLink(item, pathname))}
    />
  );
}
