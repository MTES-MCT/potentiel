'use client';

import Badge from '@codegouvfr/react-dsfr/Badge';
import Tile, { type TileProps } from '@codegouvfr/react-dsfr/Tile';
import type { ReactNode } from 'react';

import type { ProfilAuthentification } from '@/auth/profilAuthentification';
import { ProfilesBadge } from './ProfilesBadge';

export type ProviderProps = {
  isLastUsed?: boolean;
  isKO: boolean;
  profils: Record<ProfilAuthentification, boolean>;
};

type AuthTileProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: TileProps['detail'];
  className?: string;
  provider: ProviderProps;
};

export function AuthTile({ title, provider, description, action, className }: AuthTileProps) {
  return (
    <Tile
      disabled={provider.isKO}
      title={
        <>
          {provider.isLastUsed && (
            <div className="absolute right-4 top-2">
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
            profils={{
              'Porteurs de Projet': provider.profils.porteurs,
              'Agents publics': provider.profils.agents,
              'Autres Partenaires*': provider.profils.partenaires,
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
