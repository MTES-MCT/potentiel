import { getUserRole } from '@/utils/getUserRole';
import { MainNavigation, MainNavigationProps } from '@codegouvfr/react-dsfr/MainNavigation';

export async function UserNavigation() {
  const userRole = await getUserRole();

  const navigationItems = userRole ? getNavigationItemsBasedOnRole(userRole) : [];

  return (
    <>
      <MainNavigation items={navigationItems}></MainNavigation>
    </>
  );
}

const getNavigationItemsBasedOnRole = (role: string): MainNavigationProps['items'] => {
  return [
    {
      text: `Accueil (${role})`,
      linkProps: { href: '/' },
    },
  ];
};
