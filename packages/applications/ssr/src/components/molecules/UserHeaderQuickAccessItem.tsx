import { ROUTES_LEGACY } from '@/routes.legacy';
import { Utilisateur, getUser } from '@/utils/getUtilisateur';
import { HeaderQuickAccessItem } from '@codegouvfr/react-dsfr/Header';
import { ConsulterNombreTâchesQuery } from '@potentiel-domain/tache';
import { Role } from '@potentiel-domain/utilisateur';
import { mediator } from 'mediateur';
import { Route } from 'next';

export async function UserHeaderQuickAccessItem() {
  const utilisateur = await getUser();
  const accountUrl =
    `${process.env.KEYCLOAK_SERVER}/realms/${process.env.KEYCLOAK_REALM}/account` as Route;

  if (utilisateur) {
    return (
      <>
        {await getTâcheHeaderQuickAccessItem(utilisateur)}
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
              href: ROUTES_LEGACY.GET_SENREGISTRER,
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
async function getTâcheHeaderQuickAccessItem(utilisateur: Utilisateur) {
  if (Role.convertirEnValueType(utilisateur.rôle).estÉgaleÀ(Role.porteur)) {
    const { nombreTâches } = await mediator.send<ConsulterNombreTâchesQuery>({
      type: 'CONSULTER_NOMBRE_TÂCHES_QUERY',
      data: {
        email: utilisateur.email,
      },
    });

    return (
      <HeaderQuickAccessItem
        quickAccessItem={{
          iconId: nombreTâches > 0 ? 'ri-mail-unread-line' : 'ri-mail-check-line',
          linkProps: {
            href: '/taches',
          },
          text: `Tâches (${nombreTâches})`,
        }}
      />
    );
  }
}
