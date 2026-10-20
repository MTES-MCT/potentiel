import type { AppelOffre } from '@potentiel-domain/appel-offre';
import type { DateTime } from '@potentiel-domain/common';
import type { Région } from '@potentiel-domain/utilisateur';

export type DemandesProjetScope = Record<
  AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction,
  { total: number; new: number }
>;

export type GetNombreDemandesProjet = (
  rôle: 'dreal' | 'dgec',
  date: DateTime.RawType,
  régions?: Région.RawType[],
) => Promise<DemandesProjetScope>;
