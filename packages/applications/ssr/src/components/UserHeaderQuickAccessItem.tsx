import { getUser } from '@/utils/getUser';
import { HeaderQuickAccessItem } from '@codegouvfr/react-dsfr/Header';

export async function UserHeaderQuickAccessItem() {
  const user = await getUser();

  return user ? (
    <>
      <HeaderQuickAccessItem
        quickAccessItem={{
          iconId: 'ri-user-line',
          linkProps: {
            href: '/account',
          },
          text: user.name,
        }}
      />
      <HeaderQuickAccessItem
        quickAccessItem={{
          iconId: 'ri-logout-box-line',
          linkProps: {
            href: '/auth/signOut',
          },
          text: 'Me déconnecter',
        }}
      />
    </>
  ) : (
    <>
      <HeaderQuickAccessItem
        quickAccessItem={{
          iconId: 'ri-account-circle-line',
          linkProps: {
            href: '/signup.html',
          },
          text: "M'inscrire",
        }}
      />
      <HeaderQuickAccessItem
        quickAccessItem={{
          iconId: 'ri-lock-line',
          linkProps: {
            href: '/auth/signIn',
          },
          text: "M'identifier",
        }}
      />
    </>
  );
}
