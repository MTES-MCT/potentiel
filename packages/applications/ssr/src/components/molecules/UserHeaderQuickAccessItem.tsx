import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser.handler';
import { HeaderQuickAccessItem } from '@codegouvfr/react-dsfr/Header';
import { ConsulterNombreTâchesQuery } from '@potentiel-domain/tache';
import { Routes } from '@potentiel-libraries/routes';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { mediator } from 'mediateur';

export async function UserHeaderQuickAccessItem() {
  let utilisateur: Utilisateur.ValueType | undefined;

  try {
    utilisateur = await getAuthenticatedUser({});
  } catch (error) {}

  const accountUrl = `${process.env.KEYCLOAK_SERVER}/realms/${process.env.KEYCLOAK_REALM}/account`;

  if (utilisateur) {
    return (
      <>
        {await getTâcheHeaderQuickAccessItem(utilisateur)}
        {utilisateur.role.estÉgaleÀ(Role.porteur) ? (
          <HeaderQuickAccessItem
            quickAccessItem={{
              iconId: 'ri-user-line',
              buttonProps: {
                disabled: true,
              },
              text: utilisateur.nom,
            }}
          />
        ) : (
          <HeaderQuickAccessItem
            quickAccessItem={{
              iconId: 'ri-user-line',
              linkProps: {
                href: accountUrl,
              },
              text: utilisateur.nom,
            }}
          />
        )}

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

async function getTâcheHeaderQuickAccessItem(utilisateur: Utilisateur.ValueType) {
  if (utilisateur.role.estÉgaleÀ(Role.porteur)) {
    const { nombreTâches } = await mediator.send<ConsulterNombreTâchesQuery>({
      type: 'CONSULTER_NOMBRE_TÂCHES_QUERY',
      data: {
        email: utilisateur.identifiantUtilisateur.email,
      },
    });

    return (
      <HeaderQuickAccessItem
        quickAccessItem={{
          iconId: nombreTâches > 0 ? 'ri-mail-unread-line' : 'ri-mail-check-line',
          linkProps: {
            href: Routes.Tache.lister,
          },
          text: `Tâches (${nombreTâches})`,
        }}
      />
    );
  }
}
