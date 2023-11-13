import { getAccessToken } from '@/utils/getAccessToken';
import { HeaderQuickAccessItem } from '@codegouvfr/react-dsfr/Header';
import { Utilisateur } from '@potentiel-domain/utilisateur';

export async function UserHeaderQuickAccessItem() {
  const accessToken = await getAccessToken();
  const accountUrl = `${process.env.KEYCLOAK_SERVER}/realms/${process.env.KEYCLOAK_REALM}/account`;

  if (accessToken) {
    const utilisateur = Utilisateur.convertirEnValueType(accessToken);
    return (
      <>
        <HeaderQuickAccessItem
          quickAccessItem={{
            iconId: 'ri-user-line',
            linkProps: {
              href: accountUrl,
            },
            text: utilisateur.nom,
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
    );
  } else {
    return (
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
}
