import type { Région } from '@potentiel-domain/utilisateur';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type DemandesProjetScope = any;

export type GetNombreDemandesProjet = (
  rôle: 'dreal' | 'dgec',
  régions?: Région.RawType[],
) => Promise<DemandesProjetScope>;
