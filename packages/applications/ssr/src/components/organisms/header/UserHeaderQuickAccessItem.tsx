import { mediator } from 'mediateur';
import { HeaderQuickAccessItem } from '@codegouvfr/react-dsfr/Header';
import Badge from '@mui/material/Badge';

import { Utilisateur } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';
import { getContext } from '@potentiel-applications/request-context';
import { Lauréat } from '@potentiel-domain/projet';

export async function UserHeaderQuickAccessItem() {
  const utilisateur = getContext()?.utilisateur;

  if (utilisateur) {
    return (
      <>
        <TâcheHeaderQuickAccessItem utilisateur={utilisateur} />
        {utilisateur.accountUrl ? (
          <HeaderQuickAccessItem
            quickAccessItem={{
              iconId: 'ri-user-line',
              linkProps: {
                href: utilisateur.accountUrl,
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

async function TâcheHeaderQuickAccessItem({ utilisateur }: { utilisateur: Utilisateur.ValueType }) {
  if (!utilisateur.estPorteur()) {
    return null;
  }
  const { nombreTâches } = await mediator.send<Lauréat.Tâche.ConsulterNombreTâchesQuery>({
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
