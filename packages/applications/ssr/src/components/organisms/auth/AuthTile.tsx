'use client';

import Tile from '@codegouvfr/react-dsfr/Tile';
import { ReactNode } from 'react';
import Badge from '@codegouvfr/react-dsfr/Badge';

import { ProfilesBadge } from './ProfilesBadge';

export type ProviderProps = {
  isLastUsed?: boolean;
  isKO: boolean;
};

type AuthTileProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  profiles: Record<'porteurs' | 'dreal' | 'dgec' | 'autres', boolean>;
  provider: ProviderProps;
};

export function AuthTile({
  title,
  provider,
  description,
  action,
  className,
  profiles,
}: AuthTileProps) {
  return (
    <Tile
      disabled={provider.isKO}
      title={
        <>
          {provider.isLastUsed && (
            <div className="absolute right-4 top-4">
              <Badge small severity="success">
                Utilisé récemment
              </Badge>
            </div>
          )}
          <div>{title}</div>
        </>
      }
      desc={
        <>
          <ProfilesBadge
            profiles={{
              'Porteurs de Projet': profiles.porteurs,
              DREAL: profiles.dreal,
              DGEC: profiles.dgec,
              'Autres Partenaires*': profiles.autres,
            }}
            title="Profils pouvant se connecter avec ProConnect, la solution d'identité de l'État pour les professionnels"
          />
          {description}
        </>
      }
      detail={
        provider.isKO ? (
          <div>
            <div className="font-semibold">Ce service est temporairement indisponible.</div>
            <div>
              Nos équipes travaillent à la résolution de ce problème. Nous vous invitons à utiliser
              une autre méthode de connexion en attendant.
            </div>
          </div>
        ) : (
          action
        )
      }
      className={className}
    />
  );
}
