import type { AppelOffre } from '@potentiel-domain/appel-offre';
import type { DateTime } from '@potentiel-domain/common';
import type { Région } from '@potentiel-domain/utilisateur';

export type DemandesProjetScope = Record<
  AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction,
  { count: number }
>;

export type GetNombreDemandesProjet = (
  rôle: 'dreal' | 'dgec',
  régions?: Région.RawType[],
  date?: DateTime.RawType,
) => Promise<DemandesProjetScope>;
