import { GetAccessTokenMessage } from '@/bootstrap/getAccessToken.handler';
import { HeaderQuickAccessItem } from '@codegouvfr/react-dsfr/Header';
import Badge from '@mui/material/Badge';
import { ConsulterNombreTâchesQuery } from '@potentiel-domain/tache';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { mediator } from 'mediateur';

export async function UserHeaderQuickAccessItem() {
  const accessToken = await mediator.send<GetAccessTokenMessage>({
    type: 'GET_ACCESS_TOKEN',
    data: {},
  });
  const utilisateur = accessToken && Utilisateur.convertirEnValueType(accessToken);
  const accountUrl = `${process.env.KEYCLOAK_SERVER}/realms/${process.env.KEYCLOAK_REALM}/account`;

  if (utilisateur) {
    const nombreTâches =
      utilisateur.role.estÉgaleÀ(Role.porteur) && (await getNombreTâches(utilisateur));

    return (
      <>
        {nombreTâches && (
          <HeaderQuickAccessItem
            quickAccessItem={{
              iconId: 'ri-list-check-3',
              linkProps: {
                href: '/taches',
              },
              text: (
                <Badge color="secondary" badgeContent={nombreTâches}>
                  Tâche{nombreTâches > 1 && 's'}
                </Badge>
              ),
            }}
          />
        )}

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

const getNombreTâches = async (utilisateur: Utilisateur.ValueType) => {
  try {
    const { nombreTâches } = await mediator.send<ConsulterNombreTâchesQuery>({
      type: 'CONSULTER_NOMBRE_TÂCHES_QUERY',
      data: {
        email: utilisateur.identifiantUtilisateur.email,
      },
    });

    return nombreTâches;
  } catch (error) {}

  return 0;
};
