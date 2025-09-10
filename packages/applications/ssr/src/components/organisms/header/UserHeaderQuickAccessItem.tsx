import { mediator } from 'mediateur';
import { HeaderQuickAccessItem } from '@codegouvfr/react-dsfr/Header';
import Badge from '@mui/material/Badge';

import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';
import { getContext } from '@potentiel-applications/request-context';
import { Lauréat } from '@potentiel-domain/projet';

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
    const { total } = await mediator.send<Lauréat.Tâche.ListerTâchesQuery>({
      type: 'Tâche.Query.ListerTâches',
      data: {
        email: utilisateur.identifiantUtilisateur.email,
      },
    });

    if (total === 0) {
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
      <Badge badgeContent={total} max={99} color="primary" overlap="circular">
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
