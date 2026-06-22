import type { Entity } from '@potentiel-domain/entity';

import type { IdentifiantProjet } from '../../index.js';

export type TypeDeTerrainDImplantation =
  | 'cas 1'
  | 'cas 2'
  | 'cas 2 bis'
  | 'cas 3'
  | 'cas 4'
  | 'cas mixte';

export type DétailsCandidature = {
  composantsRésilients: string | undefined;
  notePrix: number | undefined;
  pv?: {
    typeTerrainImplantation: TypeDeTerrainDImplantation | undefined;
  };
  innovation?: {
    note: number | undefined;
    noteDegréInnovationSur20: number | undefined;
    notePositionnementSurLeMarchéSur10: number | undefined;
    noteQualitéTechniqueSur5: number | undefined;
    noteAdéquationAmbitionsIndustriellesSur5: number | undefined;
    noteAspectsEnvironnementauxEtSociauxSur5: number | undefined;
  };
  éolien?: {
    technologie: 'asynchrone' | 'synchrone' | undefined;
    diamètreRotorEnMètres: number | undefined;
    hauteurBoutDePâleEnMètres: number | undefined;
    installationRenouvelée: boolean | undefined;
    nombreDAérogénérateurs: number | undefined;
    puissanceUnitaireDesAérogénérateurs: number | undefined;
  };
};

export type DétailCandidatureEntity = Entity<
  'détail-candidature',
  {
    identifiantProjet: IdentifiantProjet.RawType;
  } & DétailsCandidature
>;
