import type { Entity } from '@potentiel-domain/entity';

import type { IdentifiantProjet } from '../../index.js';

export type DétailCandidatureVérifié = {
  composantsRésilients: string | undefined;
  technologieAoÉolien: 'asynchrone' | 'synchrone' | undefined;
  diamètreRotorEnMètres: string | undefined;
  hauteurBoutDePâleEnMètres: string | undefined;
  installationRenouvelée: string | undefined;
  nombreDAérogénérateurs: string | undefined;
  puissanceUnitaireDesAérogénérateurs: string | undefined;
  typeTerrainImplantation: string | undefined;
};

export type DétailCandidatureVérifiéEntity = Entity<
  'détail-candidature-vérifié',
  {
    identifiantProjet: IdentifiantProjet.RawType;
  } & DétailCandidatureVérifié
>;
