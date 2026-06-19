import type { Entity } from '@potentiel-domain/entity';

import type { IdentifiantProjet } from '../../index.js';

export type DétailCandidatureVérifié = {
  composantsRésilients: string | undefined;
  technologieAoÉolien: 'asynchrone' | 'synchrone' | undefined;
  diamètreRotorEnMètres: number | undefined;
  hauteurBoutDePâleEnMètres: number | undefined;
  installationRenouvelée: 'oui' | 'non' | undefined;
  nombreDAérogénérateurs: number | undefined;
  puissanceUnitaireDesAérogénérateurs: number | undefined;
  typeTerrainImplantation: string | undefined;
  notePrix: number | undefined;
  noteInnovation: number | undefined;
  noteDegréInnovationSur20: number | undefined;
  noteInnovationPositionnementSurLeMarchéSur10: number | undefined;
  noteInnovationQualitéTechniqueSur5: number | undefined;
  noteInnovationAdéquationAmbitionsIndustriellesSur5: number | undefined;
  noteInnovationAspectsEnvironnementauxEtSociauxSur5: number | undefined;
};

export type DétailCandidatureVérifiéEntity = Entity<
  'détail-candidature-vérifié',
  {
    identifiantProjet: IdentifiantProjet.RawType;
  } & DétailCandidatureVérifié
>;
