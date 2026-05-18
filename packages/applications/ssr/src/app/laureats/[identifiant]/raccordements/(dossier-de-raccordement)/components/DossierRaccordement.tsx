'use client';

import type { FC } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import type { Lauréat } from '@potentiel-domain/projet';

import { SupprimerDossierDuRaccordement } from '../(supprimer)/SupprimerDossierDuRaccordement';
import {
  ÉtapeDemandeComplèteRaccordement,
  type ÉtapeDemandeComplèteRaccordementProps,
} from '../[reference]/(demande-complète-raccordement)/ÉtapeDemandeComplèteRaccordement';
import {
  ÉtapePropositionTechniqueEtFinancière,
  type ÉtapePropositionTechniqueEtFinancièreProps,
} from '../[reference]/(proposition-technique-et-financière)/ÉtapePropositionTechniqueEtFinancière';
import {
  ÉtapeDateMiseEnService,
  type ÉtapeMiseEnServiceProps,
} from '../[reference]/date-mise-en-service/ÉtapeDateMiseEnService';
import { Separateur } from './Separateur';

export type DossierRaccordementProps = {
  identifiantProjet: string;
  dossier: PlainType<Lauréat.Raccordement.ConsulterRaccordementReadModel['dossiers'][number]>;
  actions: {
    miseEnService: ÉtapeMiseEnServiceProps['actions'];
    propositionTechniqueEtFinancière: ÉtapePropositionTechniqueEtFinancièreProps['actions'];
    demandeComplèteRaccordement: ÉtapeDemandeComplèteRaccordementProps['actions'];
    supprimer: boolean;
  };
};

export const DossierRaccordement: FC<DossierRaccordementProps> = ({
  identifiantProjet,
  dossier: {
    référence,
    demandeComplèteRaccordement,
    propositionTechniqueEtFinancière,
    miseEnService,
  },
  actions,
}) => (
  <>
    <div className="flex flex-col md:flex-row justify-items-stretch">
      <ÉtapeDemandeComplèteRaccordement
        identifiantProjet={identifiantProjet}
        référence={référence.référence}
        demandeComplèteRaccordement={demandeComplèteRaccordement}
        actions={actions.demandeComplèteRaccordement}
      />

      <Separateur />

      <ÉtapePropositionTechniqueEtFinancière
        identifiantProjet={identifiantProjet}
        référence={référence.référence}
        propositionTechniqueEtFinancière={propositionTechniqueEtFinancière}
        actions={actions.propositionTechniqueEtFinancière}
      />

      <Separateur />

      <ÉtapeDateMiseEnService
        identifiantProjet={identifiantProjet}
        référence={référence.référence}
        miseEnService={miseEnService}
        actions={actions.miseEnService}
      />
    </div>
    {actions.supprimer && (
      <SupprimerDossierDuRaccordement
        identifiantProjet={identifiantProjet}
        référenceDossier={référence.référence}
      />
    )}
  </>
);
