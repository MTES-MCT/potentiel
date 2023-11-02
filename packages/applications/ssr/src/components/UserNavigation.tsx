import { getUser } from '@/utils/getUser';
import { MainNavigation, MainNavigationProps } from '@codegouvfr/react-dsfr/MainNavigation';

export async function UserNavigation() {
  const user = await getUser();

  const navigationItems = user?.role ? getNavigationItemsBasedOnRole(user.role) : [];

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
