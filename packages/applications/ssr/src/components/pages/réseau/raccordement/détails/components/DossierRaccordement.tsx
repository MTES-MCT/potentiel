'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { GestionnaireRéseau as GestionnaireRéseauProps } from '../type';
import { supprimerDossierDuRaccordementAction } from '../supprimerDossierDuRaccordement.action';

import { Separateur } from './Separateur';
import { ÉtapeDemandeComplèteRaccordement } from './ÉtapeDemandeComplèteRaccordement';
import { ÉtapeMiseEnService } from './ÉtapeMiseEnService';
import { ÉtapePropositionTechniqueEtFinancière } from './ÉtapePropositionTechniqueEtFinancière';

export type DossierRaccordementProps = {
  identifiantProjet: string;
  référence: string;
  demandeComplèteRaccordement: {
    dateQualification?: Iso8601DateTime;
    accuséRéception?: string;
    canEdit: boolean;
  };
  propositionTechniqueEtFinancière: {
    dateSignature?: Iso8601DateTime;
    propositionTechniqueEtFinancièreSignée?: string;
    canEdit: boolean;
  };
  miseEnService: {
    dateMiseEnService?: Iso8601DateTime;
    canEdit: boolean;
  };
  gestionnaireRéseau?: GestionnaireRéseauProps;
  canDeleteDossier: boolean;
};

export const DossierRaccordement: FC<DossierRaccordementProps> = ({
  identifiantProjet,
  référence,
  demandeComplèteRaccordement,
  propositionTechniqueEtFinancière,
  miseEnService,
  gestionnaireRéseau,
  canDeleteDossier,
}) => {
  const isGestionnaireInconnu = gestionnaireRéseau
    ? GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        gestionnaireRéseau.identifiantGestionnaireRéseau,
      ).estÉgaleÀ(GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu)
    : false;

  return (
    <>
      <div className="flex flex-col md:flex-row justify-items-stretch">
        <ÉtapeDemandeComplèteRaccordement
          identifiantProjet={identifiantProjet}
          référence={référence}
          dateQualification={demandeComplèteRaccordement.dateQualification}
          accuséRéception={demandeComplèteRaccordement.accuséRéception}
          canEdit={demandeComplèteRaccordement.canEdit && !isGestionnaireInconnu}
        />

        <Separateur />

        <ÉtapePropositionTechniqueEtFinancière
          identifiantProjet={identifiantProjet}
          référence={référence}
          dateSignature={propositionTechniqueEtFinancière.dateSignature}
          propositionTechniqueEtFinancièreSignée={
            propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée
          }
          canEdit={propositionTechniqueEtFinancière.canEdit && !isGestionnaireInconnu}
        />

        <Separateur />

        <ÉtapeMiseEnService
          identifiantProjet={identifiantProjet}
          référence={référence}
          dateMiseEnService={miseEnService.dateMiseEnService}
          canEdit={miseEnService.canEdit && !isGestionnaireInconnu}
        />
      </div>
      {canDeleteDossier && (
        <SupprimerDossierDuRaccordement
          identifiantProjet={identifiantProjet}
          référenceDossier={référence}
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
