import { HeaderQuickAccessItem } from '@codegouvfr/react-dsfr/Header';
import Badge from '@mui/material/Badge';
import { mediator } from 'mediateur';

import { getContext } from '@potentiel-applications/request-context';
import { Routes } from '@potentiel-applications/routes';
import type { Tâche } from '@potentiel-domain/tache';
import { Role, type Utilisateur } from '@potentiel-domain/utilisateur';

export async function UserHeaderQuickAccessItem() {
  const utilisateur = getContext()?.utilisateur;

  if (utilisateur) {
    return (
      <>
        {await getTâcheHeaderQuickAccessItem(utilisateur)}
        {utilisateur.accountUrl && !utilisateur.role.estÉgaleÀ(Role.porteur) ? (
          <HeaderQuickAccessItem
            quickAccessItem={{
              iconId: 'ri-user-line',
              linkProps: {
                href: utilisateur.accountUrl,
                prefetch: false,
              },
              text: utilisateur.nom || utilisateur.identifiantUtilisateur.email,
            }}
          />
        ) : (
          <HeaderQuickAccessItem
            quickAccessItem={{
              iconId: 'ri-user-line',
              buttonProps: {
                disabled: true,
              },
              text: utilisateur.nom || utilisateur.identifiantUtilisateur.email,
            }}
          />
        )}

        <HeaderQuickAccessItem
          quickAccessItem={{
            iconId: 'ri-logout-box-line',
            linkProps: {
              href: Routes.Auth.signOut(),
              prefetch: false,
            },
            text: 'Me déconnecter',
          }}
        />
      </>
    );
  }

  return (
    <>
      <HeaderQuickAccessItem
        quickAccessItem={{
          iconId: 'ri-account-circle-line',
          linkProps: {
            href: Routes.Auth.signUp(),
            prefetch: false,
          },
          text: "M'inscrire",
        }}
      />
      <HeaderQuickAccessItem
        quickAccessItem={{
          iconId: 'ri-lock-line',
          linkProps: {
            href: Routes.Auth.signIn(),
            prefetch: false,
          },
          text: "M'identifier",
        }}
      />
    </>
  );
}

async function getTâcheHeaderQuickAccessItem(utilisateur: Utilisateur.ValueType) {
  if (utilisateur.role.estÉgaleÀ(Role.porteur)) {
    const { nombreTâches } = await mediator.send<Tâche.ConsulterNombreTâchesQuery>({
      type: 'Tâche.Query.ConsulterNombreTâches',
      data: {
        email: utilisateur.identifiantUtilisateur.email,
      },
    });

    if (nombreTâches === 0) {
      return (
        <HeaderQuickAccessItem
          quickAccessItem={{
            iconId: 'ri-mail-check-line',
            buttonProps: {
              disabled: true,
              'aria-disabled': true,
            },
            text: 'Tâches',
          }}
        />
      );
    }

    return (
      <Badge badgeContent={nombreTâches} max={99} color="primary" overlap="circular">
        <HeaderQuickAccessItem
          quickAccessItem={{
            iconId: 'fr-icon-list-ordered',
            linkProps: {
              href: Routes.Tache.lister,
              prefetch: false,
            },
            text: <div className="mr-3">Tâches</div>,
          }}
        />
      </Badge>
    );
  }
}
