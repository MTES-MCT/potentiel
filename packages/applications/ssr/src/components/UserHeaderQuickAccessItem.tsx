import { getServerSession } from 'next-auth/next';
import { HeaderQuickAccessItem } from '@codegouvfr/react-dsfr/Header';
import { authConfiguration } from '@/config/authConfiguration';

export async function UserHeaderQuickAccessItem() {
  const session = await getServerSession(authConfiguration);

  return session?.user ? (
    <>
      <HeaderQuickAccessItem
        quickAccessItem={{
          iconId: 'ri-user-line',
          linkProps: {
            href: '/account',
          },
          text: session.user.name,
        }}
      />
      <HeaderQuickAccessItem
        quickAccessItem={{
          iconId: 'ri-logout-box-line',
          linkProps: {
            href: '/logout',
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
