'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Raccordement } from '@potentiel-domain/laureat';
import { PlainType } from '@potentiel-domain/core';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { supprimerDossierDuRaccordementAction } from '../supprimerDossierDuRaccordement.action';

import { Separateur } from './Separateur';
import {
  ÉtapeDemandeComplèteRaccordement,
  ÉtapeDemandeComplèteRaccordementProps,
} from './ÉtapeDemandeComplèteRaccordement';
import { ÉtapeMiseEnService, ÉtapeMiseEnServiceProps } from './ÉtapeMiseEnService';
import {
  ÉtapePropositionTechniqueEtFinancière,
  ÉtapePropositionTechniqueEtFinancièreProps,
} from './ÉtapePropositionTechniqueEtFinancière';

export type DossierRaccordementProps = {
  identifiantProjet: string;
  dossier: PlainType<Raccordement.ConsulterRaccordementReadModel['dossiers'][number]>;
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
}) => {
  return (
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

        <ÉtapeMiseEnService
          identifiantProjet={identifiantProjet}
          référence={référence.référence}
          miseEnService={miseEnService}
          actions={actions.miseEnService}
        />
      </div>
      {actions.supprimer && !miseEnService && (
        <SupprimerDossierDuRaccordement
          identifiantProjet={identifiantProjet}
          référenceDossier={référence.référence}
        />
      )}
    </>
  );
};

type SupprimerDossierDuRaccordementProps = {
  identifiantProjet: string;
  référenceDossier: string;
};
const SupprimerDossierDuRaccordement: FC<SupprimerDossierDuRaccordementProps> = ({
  identifiantProjet,
  référenceDossier,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button priority="primary" onClick={() => setIsOpen(true)} className="mt-4">
        Supprimer
      </Button>

      <ModalWithForm
        id={`supprimer-dossier-raccordement-${référenceDossier}`}
        title={`Supprimer le dossier ${référenceDossier} du raccordement`}
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: supprimerDossierDuRaccordementAction,
          id: `supprimer-dossier-${référenceDossier}-abandon-form`,
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir supprimer le dossier {référenceDossier} du raccordement ?
              </p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
              <input type={'hidden'} value={référenceDossier} name="referenceDossier" />
            </>
          ),
        }}
      />
    </>
  );
};
